import { Injectable } from '@angular/core';
import { LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { ActivateTrialAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-trial-activation-new-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { setCustomerInfo, setSuccessfulTransactionData } from '../state/actions';
import { getSubmitCheckoutRequestData } from '../state/selectors';

interface SubmitZeroCostCheckoutWorkflowRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    serviceAddress: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        avsValidated: boolean;
    };
}

export type SubmitZeroCostCheckoutWorkflowErrors = 'PROMO_CODE_EXPIRED' | 'DEVICE_NOT_ELIGIBLE' | 'EMAIL_IN_USE' | 'EMAIL_NOT_ALLOWED' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class SubmitZeroCostCheckoutWorkflowService implements DataWorkflow<SubmitZeroCostCheckoutWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _activateTrialAccountWithSubscriptionWorkflowService: ActivateTrialAccountWithSubscriptionWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _translationService: TranslateService
    ) {}

    build(request: SubmitZeroCostCheckoutWorkflowRequest): Observable<boolean> {
        this._store.dispatch(setCustomerInfo({ customerInfo: request }));
        return this._store.select(getSubmitCheckoutRequestData).pipe(
            take(1),
            concatMap((request) => this._activateTrialAccountWithSubscriptionWorkflowService.build({ ...request, languagePreference: this._translationService.currentLang })),
            tap((transactionData) => {
                this._store.dispatch(setSuccessfulTransactionData({ transactionData }));
                this._store.dispatch(fetchSecurityQuestions({ accountRegistered: !transactionData.isEligibleForRegistration }));
            }),
            concatMap(({ radioId }) => this._loadAccountFromAccountDataWorkflow.build({ radioId })),
            map(() => true),
            catchError((error) => {
                // TODO: look to get this logic moved into the ActivateTrialAccountWithSubscriptionWorkflowService.build
                //       method since that service has internal knowledge of the service response data
                //       (don't want to do it at this time because it requires regression coverage of that service and
                //        we don't have enough automated coverage to assist with that right now)
                if (error?.status === 400) {
                    if (error?.error?.error?.errorCode.toUpperCase() === 'USERNAME_ALREADY_EXIST') {
                        return throwError('EMAIL_IN_USE');
                    } else if (error?.error?.error?.errorCode.toUpperCase() === 'USERNAME_INVALID') {
                        return throwError('EMAIL_NOT_ALLOWED');
                    }
                }
                return throwError('SYSTEM');
            })
        );
    }
}
