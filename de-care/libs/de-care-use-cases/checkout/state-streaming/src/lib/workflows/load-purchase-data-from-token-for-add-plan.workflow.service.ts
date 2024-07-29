import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { combineLatest, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getAccountFirstSubscriptionSubscriptionID, LoadAccountFromTokenWithTypeWorkflowService, selectAccount } from '@de-care/domains/account/state-account';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { initTransactionId, setSelectedPlanCode, setSelectedProvinceCode, getSelectedOffer } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
} from '@de-care/shared/state-behavior-events';
import { getParamsForCustomerOffersForPurchaseDataFromToken } from '../state/selectors';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataFromTokenForAddPlanWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromTokenWithTypeWorkflowService: LoadAccountFromTokenWithTypeWorkflowService,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build(): Observable<boolean> {
        return combineLatest([this._store.select(selectAccount), this._store.select(getSelectedOffer)]).pipe(
            concatMap(([account, offer]) => {
                return this.getAccountFromTokenAndCustomerOffers().pipe(
                    concatMap(() => {
                        if (!offer) {
                            return this.getCustomerOffers();
                        }
                        return of(true);
                    })
                );
            }),
            withLatestFrom(this._store.select(getFirstOfferPlanCode)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            mapTo(true),
            tap(() => this._store.dispatch(initTransactionId())),
            tap(() => this._store.dispatch(pageDataFinishedLoading())),
            tap(() => {
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKENIZED_ENTRY' }));
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SXIR_ADD_SUBSCRIPTION' }));
                this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'ADD_SUBSCRIPTION' }));
            })
        );
    }

    private getAccountFromTokenAndCustomerOffers() {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            concatMap(({ token }) =>
                this._loadAccountFromTokenWithTypeWorkflowService.build({
                    token,
                    tokenType: 'SALES_STREAMING',
                    student: false,
                })
            ),
            concatMap(() => this.getCustomerOffers())
        );
    }

    private getCustomerOffers() {
        return this._store.select(getParamsForCustomerOffersForPurchaseDataFromToken).pipe(
            withLatestFrom(this._store.select(getAccountFirstSubscriptionSubscriptionID)),
            take(1),
            concatMap(([{ programcode: programCode, state }, subscriptionId]) => {
                const province = this._countrySettings.countryCode === 'ca' ? state : '';
                if (province) {
                    this._store.dispatch(setSelectedProvinceCode({ provinceCode: state }));
                }
                return this._loadCustomerOffersWithCmsContent.build({ province, streaming: true, programCode, ...(subscriptionId && { subscriptionId: +subscriptionId }) });
            })
        );
    }
}
