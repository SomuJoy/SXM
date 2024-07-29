import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NonRouterNavigationService } from '@de-care/browser-common';
import {
    DataPurchaseService,
    getFirstPlanByType,
    getRadioServiceFromAccount,
    hasActiveTrial,
    isClosedRadio,
    PlanTypeEnum,
    SlocTrialActivationResponse,
    RadioModel,
} from '@de-care/data-services';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { SettingsService } from '@de-care/settings';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { ObjectTokenizerService, UrlHelperService } from '@de-care/app-common';
import { SLOC_PAGE_THANKS_SEGMENT, SLOC_SEGMENT, SUBSCRIBE_SEGMENT } from './service-lane-one-click-route-path.constants';
import { TrialActivationThanksData } from './trial-activation-thanks.resolver';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { NonPiiLookupTrialActivationWorkflow } from './processing/workflows/nonpii-trial-activation-workflow.service';
import { Account } from '@de-care/domains/account/state-account';
import { Store } from '@ngrx/store';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';

@Injectable()
export class ServiceLaneOneClickResolver implements Resolve<Observable<boolean>> {
    private readonly _window: Window;
    constructor(
        @Inject(DOCUMENT) document,
        private _nonPiiSrv: NonPiiLookupTrialActivationWorkflow,
        private _dataPurchaseService: DataPurchaseService,
        private _urlHelperService: UrlHelperService,
        private _router: Router,
        private _objectTokenizerService: ObjectTokenizerService,
        private _settingsService: SettingsService,
        private _store: Store,
        private _nonRouterNavigationService: NonRouterNavigationService
    ) {
        this._window = document && document.defaultView;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
        const token = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'cna_id');

        if (!token) {
            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Token invalid'] }));
            this._router.navigate(['/error']);
        }
        return this._dataPurchaseService.activateSLOCTrial(token).pipe(
            flatMap((activateTrialResponse: SlocTrialActivationResponse) => {
                return this._nonPiiSrv.build({ radioId: activateTrialResponse.radioId }).pipe(
                    map((nonPIIResponse) => {
                        const account = nonPIIResponse as Account;
                        const hasActTrial = hasActiveTrial(account);
                        const radioIsClosed = isClosedRadio(account);
                        if (radioIsClosed) {
                            this._router.navigate([`${SUBSCRIBE_SEGMENT}`]);
                        } else if (hasActTrial) {
                            const hasRegisteredAccount = (account && account.accountProfile && account.accountProfile.accountRegistered) || false;
                            if (hasRegisteredAccount) {
                                const refreshUrl = this._settingsService.settings.dotComRefreshUrl;
                                if (refreshUrl) {
                                    this._nonRouterNavigationService.goToLocation(refreshUrl);
                                } else {
                                    throw new Error('Missing OAC REFRESH URL');
                                }
                            } else {
                                const trialPlan = getFirstPlanByType(account, PlanTypeEnum.Trial);
                                const trialEndDate = trialPlan ? trialPlan.endDate : null;
                                const thanksData: TrialActivationThanksData = {
                                    isOfferStreamingEligible: activateTrialResponse.isOfferStreamingEligible || false,
                                    isEligibleForRegistration: activateTrialResponse.isEligibleForRegistration || false,
                                    email: activateTrialResponse.email || '',
                                    radioId: activateTrialResponse.radioId,
                                    subscriptionId: activateTrialResponse.subscriptionId || '',
                                    trialEndDate,
                                    plans: [trialPlan],
                                    radioService: getRadioServiceFromAccount(account) as RadioModel,
                                    firstName: account.firstName || '',
                                    hasUserCredentials: account.hasUserCredentials || false,
                                    useEmailAsUsername: account.useEmailAsUsername || false,
                                    hasExistingAccount: hasRegisteredAccount,
                                };
                                const thanksToken = this._objectTokenizerService.tokenize(thanksData);
                                this._router.navigate([`${SLOC_SEGMENT}/${SLOC_PAGE_THANKS_SEGMENT}`], { queryParams: { thanksToken, tkn: token } });
                            }
                        } else {
                            this._router.navigate(['/error']);
                        }

                        return true;
                    })
                );
            }),
            catchError((error) => {
                if (error?.error?.error?.errorCode === 'INELIGIBLE_FOR_TRIAL') {
                    this._router.navigate(['/activate/trial/not-eligible-error'], { queryParams: { ...route.queryParams, tkn: token } });
                } else if (error?.error?.error?.errorCode === 'SELFPAY_INELIGIBLE_FOR_TRIAL') {
                    this._router.navigate(['/activate/trial/already-active-selfpay-error'], { queryParams: { ...route.queryParams, tkn: token } });
                } else if (error?.error?.error?.errorCode === 'INCOMPLETE_TRANSACTION') {
                    this._router.navigate(['/activate/trial/cant-be-completed-online-error'], { queryParams: { ...route.queryParams, tkn: token } });
                } else {
                    this._router.navigate(['/error'], { queryParams: { ...route.queryParams, tkn: token } });
                }
                return of(false);
            })
        );
    }
}
