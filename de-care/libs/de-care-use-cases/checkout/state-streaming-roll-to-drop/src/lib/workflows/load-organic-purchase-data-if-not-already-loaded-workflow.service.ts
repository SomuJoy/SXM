import { Injectable } from '@angular/core';
import { CollectInboundQueryParamsWorkflowService, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { LoadAccountSessionInfoWorkflowService } from '@de-care/domains/account/state-session-data';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadOffersAndRenewalsWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { clearCheckoutStreamingTransactionState } from '../state/actions';
import {
    getFallbackReasonStatus,
    getOrganicOfferLoadPayload,
    getOrganicPurchaseDataHasBeenLoaded,
    getOrganicValidatePromoCodePayload,
    getSelectedOfferIsRtdTrial,
    getUsePrefillRequested,
} from '../state/selectors';

export type LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors =
    | 'SYSTEM'
    | 'PROMO_CODE_REDEEMED'
    | 'EXPIRED_OFFER'
    | 'GENERIC_ERROR'
    | 'PROMO_CODE_INVALID'
    | 'INVALID';

@Injectable({ providedIn: 'root' })
export class LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService,
        private readonly _loadOffersWithCmsContent: LoadOffersAndRenewalsWithCmsContent,
        private readonly _loadAccountSessionInfoWorkflowService: LoadAccountSessionInfoWorkflowService
    ) {}

    private _collectQueryParams$ = this._collectInboundQueryParamsWorkflowService.build();
    private _loadEnvInfo$ = this._loadEnvironmentInfoWorkflowService.build();
    private _loadPrefillData$ = this._store.select(getUsePrefillRequested).pipe(
        take(1),
        concatMap((prefillRequested) => (prefillRequested ? this._loadAccountSessionInfoWorkflowService.build() : of(true)))
    );
    private _updateUseCase$ = this._updateUsecaseWorkflowService.build({ useCase: 'RTD_STREAMING', keepCustomerInfo: true }).pipe(map(() => true));
    private _validatePromoCode$ = this._store.select(getOrganicValidatePromoCodePayload).pipe(
        take(1),
        concatMap((payload) =>
            payload
                ? this._validatePromoCodeWorkflowService.build(payload).pipe(
                      map(({ status }) => {
                          switch (status) {
                              case 'REDEEMED': {
                                  this._store.dispatch(clearCheckoutStreamingTransactionState());
                                  throw 'PROMO_CODE_REDEEMED' as LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors;
                              }
                              case 'INVALID': {
                                  this._store.dispatch(clearCheckoutStreamingTransactionState());
                                  throw 'PROMO_CODE_INVALID' as LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors;
                              }
                              case 'EXPIRED': {
                                  this._store.dispatch(clearCheckoutStreamingTransactionState());
                                  throw 'EXPIRED_OFFER' as LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors;
                              }
                          }
                          return true;
                      })
                  )
                : of(true)
        )
    );
    private _loadOfferData$ = this._store.select(getOrganicOfferLoadPayload).pipe(
        take(1),
        concatMap((loadOfferPayload) =>
            this._loadOffersWithCmsContent.build({ ...loadOfferPayload }).pipe(
                withLatestFrom(this._store.select(getFirstOfferPlanCode)),
                tap(([, planCode]) => {
                    this._store.dispatch(setSelectedPlanCode({ planCode }));
                }),
                withLatestFrom(this._store.select(getFallbackReasonStatus)),
                map(([, fallbackReason]) => {
                    if (fallbackReason) {
                        this._store.dispatch(clearCheckoutStreamingTransactionState());
                        throw 'EXPIRED_OFFER' as LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors;
                    }
                }),
                withLatestFrom(this._store.select(getSelectedOfferIsRtdTrial)),
                map(([, isRtdTrial]) => {
                    if (!isRtdTrial) {
                        this._store.dispatch(clearCheckoutStreamingTransactionState());
                        throw 'PROMO_CODE_INVALID' as LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors;
                    }
                    return true;
                })
            )
        )
    );

    build(): Observable<boolean> {
        return this._store.select(getOrganicPurchaseDataHasBeenLoaded).pipe(
            take(1),
            switchMap((alreadyLoaded) =>
                alreadyLoaded
                    ? of(true)
                    : this._loadEnvInfo$.pipe(
                          tap(() => {
                              // Async load what we can
                              this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
                          }),
                          switchMap(() => this._collectQueryParams$),
                          switchMap(() => this._loadPrefillData$), // we must do this call before the update use case call
                          switchMap(() => this._updateUseCase$),
                          switchMap(() => this._validatePromoCode$),
                          switchMap(() => this._loadOfferData$)
                      )
            ),
            map(() => true)
        );
    }
}
