import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import {
    CollectInboundQueryParamsWorkflowService,
    getSelectedOfferFallbackReasonInfo,
    initTransactionId,
    loadUpsellsForCheckoutIfNeeded,
    setAllowLicensePlateLookup,
    setSelectedProvinceCode,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getAllowedQueryParamsExist, getCampaignIdFromQueryParams, getPromoCodeFromQueryParams, getStreamingProspectTokenFromQueryParams } from '../state/selectors';
import { getProvinceFromIp } from '@de-care/domains/utility/state-ip-location';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { LoadCampaignContentWorkflowService } from '@de-care/domains/cms/state-campaigns';
import { LoadOffersWorkflowService } from './private/load-offers-workflow.service';
import { StreamingProspectTokenWorkflowService } from '@de-care/domains/account/state-account';
import { setProspectTokenData, setPromoCode } from '../state/actions';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { getSkipInitialLoadOffers } from '../state/selectors';
import { clearCheckoutStreamingTransactionState } from '../state/actions';

export type LoadPurchaseDataWorkflowErrors = 'SYSTEM' | 'LEGACY_FLOW_REQUIRED' | 'EXPIRED_OFFER' | 'GENERIC_ERROR' | 'PROMO_CODE_REDEEMED';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadCampaignContentWorkflowService: LoadCampaignContentWorkflowService,
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _streamingProspectTokenWorkflowService: StreamingProspectTokenWorkflowService,
        private _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {
        this._store.dispatch(
            setAllowLicensePlateLookup({
                allowLicensePlateLookup: this._countrySettings.countryCode.toLowerCase() !== 'ca',
            })
        );
    }

    private _setSelectedProvinceIfCanada$ =
        this._countrySettings.countryCode.toLowerCase() === 'ca'
            ? this._store.select(getProvinceFromIp).pipe(
                  take(1),
                  tap((provinceCode) => {
                      this._store.dispatch(setSelectedProvinceCode({ provinceCode }));
                  }),
                  mapTo(true)
              )
            : of(true);

    private _loadCampaign$ = this._store.select(getCampaignIdFromQueryParams).pipe(
        take(1),
        concatMap((campaignId) => (campaignId ? this._loadCampaignContentWorkflowService.build({ campaignId }) : of(true)))
    );

    private _loadProspectToken$ = this._store.select(getStreamingProspectTokenFromQueryParams).pipe(
        take(1),
        concatMap((request) =>
            request
                ? this._streamingProspectTokenWorkflowService
                      .build(request)
                      .pipe(tap((prospectTokenData) => this._store.dispatch(setProspectTokenData({ prospectTokenData }))))
                : of(true)
        )
    );

    private _validatePromoCode$ = this._store.select(getPromoCodeFromQueryParams).pipe(
        take(1),
        concatMap((marketingPromoCode) => {
            if (marketingPromoCode === '') {
                throw 'GENERIC_ERROR' as LoadPurchaseDataWorkflowErrors;
            }
            return marketingPromoCode
                ? this._validatePromoCodeWorkflowService.build({ marketingPromoCode, streaming: true }).pipe(
                      map((data) => {
                          const status = data?.status;
                          if (status === 'REDEEMED') {
                              this._store.dispatch(clearCheckoutStreamingTransactionState());
                              throw 'PROMO_CODE_REDEEMED' as LoadPurchaseDataWorkflowErrors;
                          } else if (status === 'EXPIRED') {
                              this._store.dispatch(clearCheckoutStreamingTransactionState());
                              throw 'EXPIRED_OFFER' as LoadPurchaseDataWorkflowErrors;
                          } else if (status === 'INVALID') {
                              this._store.dispatch(clearCheckoutStreamingTransactionState());
                              throw 'GENERIC_ERROR' as LoadPurchaseDataWorkflowErrors;
                          }
                          if (status === 'VALID') {
                              this._store.dispatch(setPromoCode({ promoCode: marketingPromoCode }));
                          }
                          return true;
                      })
                  )
                : of(true);
        })
    );

    build(): Observable<boolean> {
        return this._collectInboundQueryParamsWorkflowService.build().pipe(
            concatMap(() => this._setSelectedProvinceIfCanada$),
            withLatestFrom(this._store.select(getAllowedQueryParamsExist)),
            map(([, allowedQueryParamsExist]) => {
                if (!allowedQueryParamsExist) {
                    this._store.dispatch(clearCheckoutStreamingTransactionState());
                    throw 'LEGACY_FLOW_REQUIRED' as LoadPurchaseDataWorkflowErrors;
                }
                return true;
            }),
            concatMap(() => this._validatePromoCode$),
            concatMap(() => this._loadProspectToken$),
            concatMap(() => this._loadCampaign$),
            concatMap(() =>
                this._store.select(getSkipInitialLoadOffers).pipe(
                    take(1),
                    concatMap((skipInitialLoadOffers) => {
                        if (skipInitialLoadOffers) {
                            return of(true);
                        }
                        return this._loadOffersWorkflowService.build({}).pipe(
                            withLatestFrom(this._store.select(getSelectedOfferFallbackReasonInfo)),
                            map(([, fallbackInfo]) => {
                                if (fallbackInfo.isFallback && fallbackInfo.reason === 'EXPIRED') {
                                    this._store.dispatch(clearCheckoutStreamingTransactionState());
                                    throw 'EXPIRED_OFFER' as LoadPurchaseDataWorkflowErrors;
                                }
                                return true;
                            })
                        );
                    })
                )
            ),
            tap(() => {
                this._store.dispatch(initTransactionId());
                this._store.dispatch(pageDataFinishedLoading());
                // We can load the upsells asynchronously so we dispatch an action here
                this._store.dispatch(loadUpsellsForCheckoutIfNeeded({ forStreaming: true }));
            }),
            mapTo(true)
        );
    }
}
