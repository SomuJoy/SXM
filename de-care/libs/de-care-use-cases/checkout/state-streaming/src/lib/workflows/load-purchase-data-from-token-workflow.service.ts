import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    getAccountFirstSubscriptionSubscriptionID,
    getAccountIsUserNameInTokenSameAsAccount,
    getAccountRegistered,
    LoadAccountFromTokenWithTypeWorkflowService,
    resetAccountStateToInitial,
} from '@de-care/domains/account/state-account';
import { LoadCustomerOffersWithCmsContent, LoadCustomerOffersWithCmsContentError } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { initTransactionId, setSelectedPlanCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
} from '@de-care/shared/state-behavior-events';
import { getAccountFirstSubscriptionFirstPlanIsRtdTrial, getParamsForCustomerOffersForPurchaseDataFromToken } from '../state/selectors';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { getTargetedPostLoadPurchaseDataInfo } from '../state/public.selectors';

export type LoadPurchaseDataFromTokenWorkflowErrors =
    | 'SYSTEM'
    | 'NEW_CUSTOMER'
    | 'ADD_PLAN_CREDENTIALS_NON_REQUIRED'
    | 'ADD_PLAN_CREDENTIALS_REQUIRED'
    | 'NOT_ELIGIBLE'
    | 'ALREADY_HAVE_A_SUBSCRIPTION';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataFromTokenWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromTokenWithTypeWorkflowService: LoadAccountFromTokenWithTypeWorkflowService,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            concatMap(({ token }) =>
                this._loadAccountFromTokenWithTypeWorkflowService
                    .build({
                        token,
                        tokenType: 'SALES_STREAMING',
                        student: false,
                    })
                    .pipe(
                        withLatestFrom(
                            this._store.select(getAccountFirstSubscriptionSubscriptionID),
                            this._store.select(getAccountRegistered),
                            this._store.select(getAccountIsUserNameInTokenSameAsAccount)
                        ),
                        map(([result, hasActiveSubscription, isRegistered, isUserNameInTokenSameAsAccount]) => {
                            if (!hasActiveSubscription) {
                                if (!isRegistered) {
                                    this._store.dispatch(resetAccountStateToInitial());
                                    throw 'NEW_CUSTOMER' as LoadPurchaseDataFromTokenWorkflowErrors;
                                }
                                if (!isUserNameInTokenSameAsAccount) {
                                    throw 'ADD_PLAN_CREDENTIALS_REQUIRED' as LoadPurchaseDataFromTokenWorkflowErrors;
                                }
                                throw 'ADD_PLAN_CREDENTIALS_NON_REQUIRED' as LoadPurchaseDataFromTokenWorkflowErrors;
                            }
                            return result;
                        })
                    )
            ),
            concatMap(() =>
                this._store.select(getParamsForCustomerOffersForPurchaseDataFromToken).pipe(
                    withLatestFrom(this._store.select(getAccountFirstSubscriptionSubscriptionID)),
                    take(1),
                    concatMap(([{ programcode: programCode, state }, subscriptionId]) => {
                        const province = this._countrySettings.countryCode === 'ca' ? state : '';
                        if (province) {
                            this._store.dispatch(setSelectedProvinceCode({ provinceCode: state }));
                        }
                        return this._loadCustomerOffersWithCmsContent.build({ province, streaming: true, programCode, subscriptionId: +subscriptionId }).pipe(
                            catchError((error) => {
                                // TODO: look to move this error investigation logic into LoadCustomerOffersWithCmsContent to simplify this error catch
                                //       (have that service throw a simple error type like this service does)
                                if (error === ('NO_OFFERS_PRESENTED' as LoadCustomerOffersWithCmsContentError)) {
                                    return of(true);
                                }
                                if (error?.status === 412 && error?.error?.error?.errorCode === 'INELIGIBLE_OFFER') {
                                    throw 'NOT_ELIGIBLE' as LoadPurchaseDataFromTokenWorkflowErrors;
                                }
                                if (error?.status === 412 && error?.error?.error?.errorCode === 'ALREADY_HAVE_A_SUBSCRIPTION') {
                                    throw 'ALREADY_HAVE_A_SUBSCRIPTION' as LoadPurchaseDataFromTokenWorkflowErrors;
                                }
                                throw 'SYSTEM' as LoadPurchaseDataFromTokenWorkflowErrors;
                            })
                        );
                    }),
                    withLatestFrom(this._store.select(getTargetedPostLoadPurchaseDataInfo)),
                    map(([_, { hasOneSelfPay, selectedOfferIsRtpPromo, noOffersPresented }]) => {
                        // For a future merge: we want to avoid having a check here for fallback
                        if (hasOneSelfPay && !selectedOfferIsRtpPromo) {
                            throw 'ALREADY_HAVE_A_SUBSCRIPTION' as LoadPurchaseDataFromTokenWorkflowErrors;
                        }

                        if (noOffersPresented) {
                            throw 'SYSTEM' as LoadPurchaseDataFromTokenWorkflowErrors;
                        }
                        return true;
                    })
                )
            ),
            withLatestFrom(this._store.select(getFirstOfferPlanCode), this._store.select(getAccountFirstSubscriptionFirstPlanIsRtdTrial)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            tap(() => this._store.dispatch(initTransactionId())),
            tap(() => this._store.dispatch(pageDataFinishedLoading())),
            tap(([, , accountFirstSubscriptionFirstPlanIsRtdTrial]) => {
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKENIZED_ENTRY' }));
                const customerType = accountFirstSubscriptionFirstPlanIsRtdTrial ? 'SXIR_IN_TRIAL' : 'SXIR_ADD_SUBSCRIPTION';
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType }));
                this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'ADD_SUBSCRIPTION' }));
            }),
            mapTo(true)
        );
    }
}
