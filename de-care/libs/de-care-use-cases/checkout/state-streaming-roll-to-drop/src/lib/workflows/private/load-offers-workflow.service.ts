import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadCustomerOffersAndRenewalWithCmsContent, LoadOffersAndRenewalsWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { setSelectedPlanCode, getSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getPayloadForOffersLoad } from '../../state/selectors';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class LoadOffersWorkflowService implements DataWorkflow<{ retrieveFallbackOffer?: boolean; redemptionType?: string }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersWithCmsContent: LoadOffersAndRenewalsWithCmsContent,
        private readonly _loadCustomerOffersAndRenewalWithCmsContent: LoadCustomerOffersAndRenewalWithCmsContent,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getPayloadForOffersLoad).pipe(
            withLatestFrom(this._store.select(getSelectedProvinceCode)),
            take(1),
            map(([payload, province]) => {
                return {
                    ...payload,
                    request: {
                        ...payload.request,
                        ...(this._countrySettings.countryCode.toLocaleLowerCase() === 'ca' ? { province } : {}),
                    },
                };
            }),
            concatMap(({ request, useCustomerOfferCall }) =>
                useCustomerOfferCall ? this._loadCustomerOffersAndRenewalWithCmsContent.build(request) : this._loadOffersWithCmsContent.build(request)
            ),
            withLatestFrom(this._store.select(getFirstOfferPlanCode)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            mapTo(true)
        );
    }
}
