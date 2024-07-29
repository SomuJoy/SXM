import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadOffersAndFollowOnsForStreamingWithCmsContent, LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { setSelectedPlanCode, getSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getPayloadForOffersLoad } from '../../state/selectors';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class LoadOffersWorkflowService implements DataWorkflow<{ retrieveFallbackOffer?: boolean; redemptionType?: string }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersAndFollowOnsForStreamingWithCmsContent: LoadOffersAndFollowOnsForStreamingWithCmsContent,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build({ retrieveFallbackOffer = false, redemptionType }: { retrieveFallbackOffer?: boolean; redemptionType?: string }): Observable<boolean> {
        return this._store.select(getPayloadForOffersLoad).pipe(
            withLatestFrom(this._store.select(getSelectedProvinceCode)),
            take(1),
            map(([payload, province]) => {
                return {
                    ...payload,
                    request: {
                        ...payload.request,
                        ...(this._countrySettings.countryCode === 'ca' ? { province } : {}),
                        ...(redemptionType && { redemptionType }),
                        ...(retrieveFallbackOffer && { retrieveFallbackOffer }),
                    },
                };
            }),
            concatMap(({ request, useCustomerOfferCall }) => {
                const doesOfferNeedFollowOn = (offer) => offer.type === 'STEP_UP';
                return useCustomerOfferCall
                    ? this._loadCustomerOffersWithCmsContent.build({
                          ...request,
                          doesOfferNeedFollowOn,
                      })
                    : this._loadOffersAndFollowOnsForStreamingWithCmsContent.build({
                          ...request,
                          doesOfferNeedFollowOn,
                          student: false,
                      });
            }),
            withLatestFrom(this._store.select(getFirstOfferPlanCode)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            mapTo(true)
        );
    }
}
