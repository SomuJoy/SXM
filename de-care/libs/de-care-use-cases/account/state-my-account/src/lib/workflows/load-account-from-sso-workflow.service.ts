import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { loadNba, setCancelByChatAllowed } from '../state/actions';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';

export type LoadAccountFromSsoWorkflowServiceError = 'NOT_AUTHENTICATED' | 'SYSTEM' | 'SECURITY_LEVEL_LOW' | 'ACCOUNT_NOT_REGISTERED';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromSsoWorkflowService implements DataWorkflow<null, boolean> {
    constructor(
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build(): Observable<boolean> {
        return this._loadAccountWorkflowService.build({ includeFuturePaymentInfo: true, refreshAccount: true }).pipe(
            tap(() => {
                this._store.dispatch(pageDataFinishedLoading());
                this._store.dispatch(loadNba());
                this._store.dispatch(setCancelByChatAllowed({ cancelByChatAllowed: this._countrySettings.countryCode.toLowerCase() === 'ca' }));
                this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'account' }));
            }),
            // TODO: DASHBOARD_CMS: eventually add getAccountFirstSubscriptionSubscriptionID
            // return this._loadCustomerOffersUpgradeWithCmsContent.build({ subscriptionId });
            // determine if type is RTC, if so call LoadRenewalOffersWithCmsContent
            // call upsell offer info service (loadUpsellOfferInfoForUpsellOffers)?  not clear given there is no leadOfferPlanCode
            //
            mapTo(true),
            catchError((err) => {
                // TODO: DASHBOARD_CMS: If there is an offers info error, allow the rest of dashboard to load
                if (err.errorCode === 'FAILED_TO_LOAD_ACCOUNT') {
                    throw 'SYSTEM' as LoadAccountFromSsoWorkflowServiceError;
                } else if (err.errorCode === 'SECURITY_LEVEL_LOW') {
                    throw 'SECURITY_LEVEL_LOW' as LoadAccountFromSsoWorkflowServiceError;
                } else if (err.errorCode === 'ACCOUNT_NOT_REGISTERED') {
                    throw 'ACCOUNT_NOT_REGISTERED' as LoadAccountFromSsoWorkflowServiceError;
                } else {
                    // If there is any error loading the account from SSO then we treat it like not authenticated for now
                    throw 'NOT_AUTHENTICATED' as LoadAccountFromSsoWorkflowServiceError;
                }
            })
        );
    }
}
