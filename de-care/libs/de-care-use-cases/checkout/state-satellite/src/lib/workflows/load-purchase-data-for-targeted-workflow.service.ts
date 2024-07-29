import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import {
    CollectInboundQueryParamsWorkflowService,
    setSelectedPlanCode,
    initTransactionId,
    loadUpsellsForSatelitteTargetedCheckoutIfNeeded,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getConfiguredLeadOfferOrFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    getAccountRequestData,
    getAccountSubscriptionHasActiveNonTrialSubscription,
    getAllowedQueryParamsExist,
    getOfferRequestData,
    getSelectedRadioId,
} from '../state/selectors';
import { LoadCustomerOffersAndRenewalWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { LoadAccountDataWorkflowErrors, LoadAccountDataWorkflowService } from './load-account-data-workflow.service';
import { CookieService } from 'ngx-cookie-service';

export type LoadPurchaseDataForTargetedWorkflowErrors = ('SYSTEM' | 'ACTIVE_SATELLITE_SUBSCRIPTION' | 'LEGACY_FLOW_REQUIRED') & LoadAccountDataWorkflowErrors;

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataForTargetedWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadCustomerOffersAndRenewalWithCmsContent: LoadCustomerOffersAndRenewalWithCmsContent,
        private readonly _loadAccountDataWorkflowService: LoadAccountDataWorkflowService,
        private _cookieService: CookieService
    ) {}

    private _checkForAllowedEntry$ = this._store.select(getAllowedQueryParamsExist).pipe(
        take(1),
        map((allowedQueryParamsExist) => {
            if (allowedQueryParamsExist) {
                return true;
            } else {
                throw 'LEGACY_FLOW_REQUIRED' as LoadPurchaseDataForTargetedWorkflowErrors;
            }
        })
    );

    private _loadAccount$ = this._store.select(getAccountRequestData).pipe(
        take(1),
        concatMap(({ token, accountNumber, radioId, lastName, tokenType }) => {
            if (!token && !radioId) {
                token = this._cookieService.get('ID_TOKEN');
                tokenType = 'ACCOUNT';
            }
            return this._loadAccountDataWorkflowService.build({ token, accountNumber, radioId, lastName, tokenType });
        })
    );

    private _checkForActiveSubscription$ = this._store.select(getAccountSubscriptionHasActiveNonTrialSubscription).pipe(
        take(1),
        map((hasActiveSubscription) => {
            if (hasActiveSubscription) {
                throw 'ACTIVE_SATELLITE_SUBSCRIPTION' as LoadPurchaseDataForTargetedWorkflowErrors;
            } else {
                return true;
            }
        })
    );

    private _loadOffers$ = this._store.select(getOfferRequestData).pipe(
        take(1),
        concatMap(({ programCode, radioId, marketingPromoCode }) =>
            this._loadCustomerOffersAndRenewalWithCmsContent.build({
                ...(programCode ? { programCode } : {}),
                radioId,
                ...(marketingPromoCode ? { marketingPromoCode } : {}),
                streaming: false,
            })
        ),
        withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode)),
        tap(([, planCode]) => {
            this._store.dispatch(setSelectedPlanCode({ planCode }));
        }),
        mapTo(true)
    );

    private _loadUpsellsIfNeeded$ = this._store.select(getSelectedRadioId).pipe(
        take(1),
        tap((radioId) => {
            this._store.dispatch(loadUpsellsForSatelitteTargetedCheckoutIfNeeded({ radioId }));
        }),
        mapTo(true)
    );

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutsatellite' }));
        return this._collectInboundQueryParamsWorkflowService.build().pipe(
            concatMap(() => this._checkForAllowedEntry$),
            concatMap(() => this._loadAccount$),
            concatMap(() => this._checkForActiveSubscription$),
            concatMap(() => this._loadOffers$),
            concatMap(() => this._loadUpsellsIfNeeded$),
            tap(() => {
                this._store.dispatch(initTransactionId());
                this._store.dispatch(pageDataFinishedLoading());
            })
        );
    }
}
