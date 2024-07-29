import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import {
    getSubscriptionIdFromAccount,
    LoadAccountFromTokenWorkflowService,
    isActiveSubscription,
    CustomerTypeEnum,
    setPrefillEmail,
} from '@de-care/domains/account/state-account';
import {
    VerifyStudentWorkflowService,
    ServerResponseStudentVerificationErrorInvalidToken,
    ServerResponseStudentVerificationErrorFailedValidation,
} from '@de-care/domains/identity/state-verify-student';
import { CheckStudentEligibilityStatusWorkflowService, ProcessResultStatus } from '@de-care/domains/offers/state-eligibility';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { verificationResponse } from './data-services/verification-response.interface';
import { Store } from '@ngrx/store';
import { eligibilityComplete, verificationIdCheckComplete } from './state/actions';
import { behaviorEventReactionForCustomerType } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class ConfirmReVerifyWorkflowService
    implements DataWorkflow<{ token: string; programCode: string; verificationId: string; isStreaming: boolean }, ProcessResultStatus>
{
    constructor(
        private _loadAccountFromTokenForWorkflowService: LoadAccountFromTokenWorkflowService,
        private _verifyStudentWorkflowService: VerifyStudentWorkflowService,
        private _checkStudentEligibilityStatusWorkflowService: CheckStudentEligibilityStatusWorkflowService,
        private _store: Store
    ) {}

    build({ token, programCode, verificationId, isStreaming }): Observable<ProcessResultStatus> {
        return this._loadAccountFromTokenForWorkflowService.build({ token, isStreaming, student: true, tokenType: 'SALES_STREAMING' }).pipe(
            concatMap((accountResult) => {
                const subscriptionId = getSubscriptionIdFromAccount(accountResult.nonPIIAccount);
                const account = accountResult.nonPIIAccount;
                return isActiveSubscription(account, subscriptionId)
                    ? this._verifyStudentWorkflowServiceBuild(verificationId, subscriptionId)
                    : of<ProcessResultStatus>('NO_ACTIVE_SUBSCRIPTION');
            }),
            catchError(() => of<ProcessResultStatus>('INVALID_ACCOUNT_TOKEN'))
        );
    }

    private _verifyStudentWorkflowServiceBuild(verificationId, subscriptionId): Observable<ProcessResultStatus> {
        return this._verifyStudentWorkflowService.build({ verificationId }).pipe(
            concatMap((studentInfo) => {
                if (studentInfo) {
                    this._store.dispatch(setPrefillEmail({ email: studentInfo?.email }));
                    this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.success }));
                    this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: CustomerTypeEnum.ReverifyStudent }));

                    return this._checkStudentEligibilityStatusWorkflowService.build({ subscriptionId }).pipe(
                        tap((status) => this._store.dispatch(eligibilityComplete({ status }))),
                        catchError(() => {
                            this._store.dispatch(eligibilityComplete({ status: 'ERROR' }));
                            return of<ProcessResultStatus>('ERROR');
                        })
                    );
                } else {
                    this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.failure }));
                    return of<ProcessResultStatus>('ERROR');
                }
            }),
            catchError((err) => {
                if (err?.error?.error?.errorCode === ServerResponseStudentVerificationErrorInvalidToken) {
                    this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.noVerification }));
                    return of<ProcessResultStatus>('INVALID_VERIFICATION_TOKEN');
                }

                if (err?.error?.error?.fieldErrors && err.error.error.fieldErrors[0].errorCode === ServerResponseStudentVerificationErrorFailedValidation) {
                    this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.rejected }));
                    return of<ProcessResultStatus>('FAILED_VERIFICATION');
                }
                this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.failure }));
                return of<ProcessResultStatus>('ERROR');
            })
        );
    }
}
