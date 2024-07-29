import { Inject, Injectable } from '@angular/core';
import { getSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getFirstAccountSubscriptionId } from '@de-care/domains/account/state-account';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedPlanCode } from '../state/public.actions';
import { getProgramCode, getSelectedOfferIsFallback } from '../state/selectors';

export type SetAccountInfoAndProcessAfterLpzVerificationWorkflowErrors = 'OFFER_IS_FALLBACK';
@Injectable({
    providedIn: 'root',
})
export class SetAccountInfoAndProcessAfterLpzVerificationWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build() {
        return this._store.select(getProgramCode).pipe(
            take(1),
            withLatestFrom(this._store.select(getFirstAccountSubscriptionId), this._store.select(getSelectedProvinceCode)),
            concatMap(([programCode, subscriptionId, province]) =>
                this._loadCustomerOffersWithCmsContent.build({
                    streaming: true,
                    student: false,
                    programCode,
                    subscriptionId: +subscriptionId,
                    ...(this._countrySettings.countryCode === 'ca' && { province }),
                })
            ),
            withLatestFrom(this._store.select(getFirstOfferPlanCode)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            withLatestFrom(this._store.select(getSelectedOfferIsFallback)),
            tap(([_, offerIsFallback]) => {
                if (offerIsFallback) {
                    throw 'OFFER_IS_FALLBACK' as SetAccountInfoAndProcessAfterLpzVerificationWorkflowErrors;
                }
            }),
            mapTo(true)
        );
    }
}
