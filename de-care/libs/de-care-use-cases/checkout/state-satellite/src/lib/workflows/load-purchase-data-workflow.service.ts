import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { CollectInboundQueryParamsWorkflowService, initTransactionId, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { getAllowedQueryParamsExist, getOfferRequestDataForOrganic, getPromoCodeFromQueryParams } from '../state/selectors';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getConfiguredLeadOfferOrFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';

export type LoadPurchaseDataWorkflowErrors = 'SYSTEM' | 'LEGACY_FLOW_REQUIRED' | 'PROMO_CODE_EXPIRED' | 'PROMO_CODE_INVALID' | 'PROMO_CODE_REDEEMED';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent,
        private _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService
    ) {}

    private _checkForAllowedEntry$ = this._store.select(getAllowedQueryParamsExist).pipe(
        take(1),
        map((allowedQueryParamsExist) => {
            if (allowedQueryParamsExist) {
                return true;
            } else {
                throw 'LEGACY_FLOW_REQUIRED' as LoadPurchaseDataWorkflowErrors;
            }
        })
    );

    private _loadOffers$ = this._store.select(getOfferRequestDataForOrganic).pipe(
        take(1),
        concatMap((request) => this._loadOffersWithCmsContent.build({ ...request, streaming: false })),
        withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode)),
        tap(([, planCode]) => {
            this._store.dispatch(setSelectedPlanCode({ planCode }));
        }),
        mapTo(true)
    );

    private _validatePromoCode$ = this._store.select(getPromoCodeFromQueryParams).pipe(
        take(1),
        concatMap((marketingPromoCode) => {
            if (marketingPromoCode === '') {
                throw 'PROMO_CODE_INVALID' as LoadPurchaseDataWorkflowErrors;
            }
            return marketingPromoCode
                ? this._validatePromoCodeWorkflowService.build({ marketingPromoCode, streaming: false }).pipe(
                      map((data) => {
                          const status = data?.status;
                          if (status === 'REDEEMED') {
                              throw 'PROMO_CODE_REDEEMED' as LoadPurchaseDataWorkflowErrors;
                          } else if (status === 'EXPIRED') {
                              throw 'PROMO_CODE_EXPIRED' as LoadPurchaseDataWorkflowErrors;
                          } else if (status === 'INVALID') {
                              throw 'PROMO_CODE_INVALID' as LoadPurchaseDataWorkflowErrors;
                          }
                          return true;
                      })
                  )
                : of(true);
        })
    );

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutsatellite' }));
        return this._collectInboundQueryParamsWorkflowService.build().pipe(
            concatMap(() => this._checkForAllowedEntry$),
            concatMap(() => this._validatePromoCode$),
            concatMap(() => this._loadOffers$),
            tap(() => {
                this._store.dispatch(initTransactionId());
                this._store.dispatch(pageDataFinishedLoading());
            })
        );
    }
}
