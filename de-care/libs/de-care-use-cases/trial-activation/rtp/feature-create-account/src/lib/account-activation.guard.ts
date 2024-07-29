import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { AccountActivationWorkflowStatus, DataAccountActivationWorkflow } from '@de-care/de-care-use-cases/trial-activation/rtp/state-create-account';
import {
    setIngressValuesForTrialActivationRTP,
    getCreateAccountShouldShowError,
    getIsCreateAccountStepComplete
} from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { behaviorEventReactionForTransactionType, behaviorEventReactionCustomerInfoAuthenticationType } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class CanActivateAccountActivationService implements CanActivate {
    constructor(
        private readonly _urlHelperService: UrlHelperService,
        private readonly _dataAccountActivationWorkflow: DataAccountActivationWorkflow,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot) {
        // [TODO] Should we redirect if this is Canada?
        this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'RFLZ' }));
        return this._store.pipe(
            select(getCreateAccountShouldShowError),
            withLatestFrom(this._store.pipe(select(getIsCreateAccountStepComplete))),
            take(1),
            switchMap(([shouldShowError, stepComplete]) => {
                if (!(shouldShowError || stepComplete)) {
                    const programCode = this._urlHelperService.getCaseInsensitiveParam(activatedRouteSnapshot.queryParamMap, 'programCode');
                    const radioId = this._urlHelperService.getCaseInsensitiveParam(activatedRouteSnapshot.queryParamMap, 'radioId');
                    const usedCarBrandingType = this._urlHelperService.getCaseInsensitiveParam(activatedRouteSnapshot.queryParamMap, 'usedCarBrandingType');
                    const redirectURL = this._urlHelperService.getCaseInsensitiveParam(activatedRouteSnapshot.queryParamMap, 'redirectURL');

                    this._store.dispatch(setIngressValuesForTrialActivationRTP({ last4digitsOfRadioId: radioId, programCode, usedCarBrandingType, redirectURL }));

                    return this._dataAccountActivationWorkflow
                        .build({
                            radioId,
                            programCode,
                            usedCarBrandingType,
                            accountNumber: null,
                            pvtTime: null
                        })
                        .pipe(
                            map(status => {
                                switch (status) {
                                    case AccountActivationWorkflowStatus.success:
                                        this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'TRIAL_ACTIVATION' }));
                                        return true;
                                    case AccountActivationWorkflowStatus.offerTypeIsIncorrect:
                                        return this._router.createUrlTree(['activate', 'trial'], { queryParams: activatedRouteSnapshot.queryParamMap });
                                    case AccountActivationWorkflowStatus.offer400error:
                                        return this._router.createUrlTree(['subscribe', 'checkout', 'flepz'], { queryParams: activatedRouteSnapshot.queryParamMap });
                                    case AccountActivationWorkflowStatus.fail || AccountActivationWorkflowStatus.sessionFailed:
                                        return this._router.createUrlTree(['error']);
                                }
                            })
                        );
                } else {
                    return of(true);
                }
            })
        );
    }
}
