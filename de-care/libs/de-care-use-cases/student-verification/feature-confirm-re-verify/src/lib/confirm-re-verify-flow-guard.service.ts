import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import {
    ConfirmReVerifyWorkflowService,
    ActivateStudentRolloverWorkflowService,
    ActivateStudentRolloverWorkflowServiceStatus,
    ActivateStudentOfferToOfferWorkflowService,
    ActivateStudentOfferToOfferWorkflowServiceStatus,
    reverifyGuardWorkflowStarted,
    reverifyGuardWorkflowComplete,
    changePlanComplete,
    passFailResponse,
    o2oComplete,
    verificationIdCheckComplete,
    verificationResponse,
    getQueryParamsAndSettings,
} from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { concatMap, catchError, finalize, first } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { UrlHelperService } from '@de-care/app-common';

@Injectable({ providedIn: 'root' })
export class ConfirmReVerifyFlowGuardService implements CanActivate {
    constructor(
        private _router: Router,
        private _urlHelperService: UrlHelperService,
        private _confirmReVerifyWorkflowService: ConfirmReVerifyWorkflowService,
        private _activateStudentRolloverWorkflowService: ActivateStudentRolloverWorkflowService,
        private _activateStudentOfferToOfferWorkflowService: ActivateStudentOfferToOfferWorkflowService,
        private _store: Store
    ) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<UrlTree> {
        let isCanada;
        const token = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'tkn');
        const verificationId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'verificationId');
        const programCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programCode');

        this._store.pipe(select(getQueryParamsAndSettings), first()).subscribe((params) => {
            isCanada = params.isCanada;
        });

        const isStreaming = true; // TODO: Set to look at route path for 'streaming'

        if (token && verificationId && programCode) {
            this._store.dispatch(reverifyGuardWorkflowStarted());

            return this._confirmReVerifyWorkflowService.build({ token, programCode, verificationId, isStreaming }).pipe(
                concatMap((status) => {
                    if (status === 'CONFIRMATION') {
                        return this._rolloverEligible(programCode);
                    }
                    if (status === 'O2O_SUCCESS') {
                        return this._o2oEligible(programCode);
                    }
                    return of(this._handleNonActiveSubscription({ status, token, programCode, verificationId }));
                }),
                catchError(() => of(this._goToGlobalError())),
                finalize(() => {
                    this._store.dispatch(reverifyGuardWorkflowComplete());
                })
            );
        } else {
            if (!verificationId) {
                this._store.dispatch(verificationIdCheckComplete({ status: verificationResponse.noVerification }));
            }

            throwError('Insufficient Url Params Supplied');
        }
    }

    private _rolloverEligible(programCode) {
        return this._activateStudentRolloverWorkflowService.build({ programCode }).pipe(
            concatMap((result) => {
                if (result === ActivateStudentRolloverWorkflowServiceStatus.success) {
                    this._store.dispatch(changePlanComplete({ status: passFailResponse.success }));
                    return of(this._goToConfirmation());
                }

                return throwError('Change plan call failed');
            }),
            catchError(() => {
                this._store.dispatch(changePlanComplete({ status: passFailResponse.failure }));
                return of(this._goToGlobalError());
            })
        );
    }

    private _o2oEligible(programCode) {
        return this._activateStudentOfferToOfferWorkflowService.build({ programCode }).pipe(
            concatMap((result) => {
                if (result === ActivateStudentOfferToOfferWorkflowServiceStatus.success) {
                    this._store.dispatch(o2oComplete({ status: passFailResponse.success }));
                    return of(this._goToOfferToOffer());
                }

                return throwError('Offer to offer call failed');
            }),
            catchError(() => {
                this._store.dispatch(o2oComplete({ status: passFailResponse.failure }));
                return of(this._goToGlobalError());
            })
        );
    }

    private _handleNonActiveSubscription({ status, token, programCode, verificationId }) {
        switch (status) {
            case 'ACTIVE_SUBSCRIPTION':
                return this._goToActiveSubscription();
            case 'NO_ACTIVE_SUBSCRIPTION':
                return this._goToStudentStreaming(token, programCode, verificationId);
            case 'INELIGIBLE':
                return this._goToError();
            case 'INVALID_ACCOUNT_TOKEN':
                return this._goToInvalidTokenError();
            case 'INVALID_VERIFICATION_TOKEN':
                return this._goToStudentReverifyLanding(token, programCode);
            case 'FAILED_VERIFICATION':
                return this._goToError();
            default:
                return this._goToGlobalError();
        }
    }

    private _goToConfirmation(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'roll-over-complete']);
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'error']);
    }

    private _goToInvalidTokenError(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'error']);
    }

    private _goToGlobalError(): UrlTree {
        return this._router.createUrlTree(['error']);
    }

    private _goToActiveSubscription(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'active-subscription']);
    }

    private _goToStudentStreaming(tkn: string, programCode: string, verificationId: string): UrlTree {
        return this._router.createUrlTree(['subscribe', 'checkout', 'streaming'], { queryParams: { tkn, programCode, verificationId } });
    }

    private _goToOfferToOffer(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'complete']);
    }

    private _goToStudentReverifyLanding(tkn: string, programCode: string): UrlTree {
        return this._router.createUrlTree(['student', 're-verify'], { queryParams: { tkn, programCode } });
    }
}
