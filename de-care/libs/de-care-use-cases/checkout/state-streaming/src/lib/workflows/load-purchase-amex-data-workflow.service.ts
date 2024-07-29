import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { CollectInboundQueryParamsWorkflowService, initTransactionId, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getAllowedQueryParamsExistForAMex, getCampaignIdFromQueryParams } from '../state/selectors';
import { behaviorEventErrorFromSystem, behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { getProvinceFromIp } from '@de-care/domains/utility/state-ip-location';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { LoadCampaignContentWorkflowService } from '@de-care/domains/cms/state-campaigns';
import { LoadOffersWorkflowService } from './private/load-offers-workflow.service';
import { AmexError, AmexService } from '@de-care/shared/amex-sdk';

export type LoadPurchaseAmexDataWorkflowErrors = 'SYSTEM' | 'LEGACY_FLOW_REQUIRED' | 'INVALID_QUERY_PARAM' | 'AMEX_SDK_ERROR' | 'AMEX_ERROR_CUSTOM_REDIRECTION';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseAmexDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadCampaignContentWorkflowService: LoadCampaignContentWorkflowService,
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly amexService: AmexService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

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

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutstreamingorganicamex' }));
        return this._collectInboundQueryParamsWorkflowService.build().pipe(
            concatMap(() => this._setSelectedProvinceIfCanada$),
            withLatestFrom(this._store.select(getAllowedQueryParamsExistForAMex)),
            map(([, allowedQueryParamsExist]) => {
                if (!allowedQueryParamsExist) {
                    throw 'INVALID_QUERY_PARAM' as LoadPurchaseAmexDataWorkflowErrors;
                }
                return true;
            }),
            concatMap(() =>
                this.amexService.initAndValidateUser({ shouldStripUrl: false }).pipe(
                    catchError((e: AmexError) => {
                        if (e.type === 'SYSTEM') {
                            const error = e.error as Error;
                            this._store.dispatch(
                                behaviorEventErrorFromSystem({
                                    message: error.message,
                                })
                            );
                        }
                        if (e.type === 'EMPTY_CAMPAIGN_UUID') {
                            throw 'AMEX_ERROR_CUSTOM_REDIRECTION' as LoadPurchaseAmexDataWorkflowErrors;
                        }
                        throw 'AMEX_SDK_ERROR' as LoadPurchaseAmexDataWorkflowErrors;
                    })
                )
            ),
            concatMap(() => this._loadCampaign$),
            concatMap(() => this._loadOffersWorkflowService.build({})),
            tap(() => {
                this._store.dispatch(initTransactionId());
                this._store.dispatch(pageDataFinishedLoading());
            }),
            mapTo(true)
        );
    }
}
