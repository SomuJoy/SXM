import { Injectable } from '@angular/core';
import { getConfiguredLeadOfferOrFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { collectAllInboundQueryParams, initTransactionId, setSelectedPlanCode } from '../state/actions';
import { getOffersRequestData, getPromoCodeFromInboundQueryParams } from '../state/selectors';

export type LoadZeroCostCheckoutWorkflowErrors = 'PROMO_CODE_USED' | 'NO_PROMO_CODE' | 'PROMO_CODE_INVALID' | 'PROMO_CODE_EXPIRED' | 'OFFER_EXPIRED' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadZeroCostCheckoutWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent
    ) {}

    collectInboundQueryParams$ = this._store.select(getNormalizedQueryParams).pipe(
        take(1),
        tap((inboundQueryParams) => this._store.dispatch(collectAllInboundQueryParams({ inboundQueryParams }))),
        map(() => true)
    );
    validatePromoCode$ = this._store.select(getPromoCodeFromInboundQueryParams).pipe(
        take(1),
        map((marketingPromoCode) => {
            if (!marketingPromoCode) {
                throw 'NO_PROMO_CODE' as LoadZeroCostCheckoutWorkflowErrors;
            }
            return marketingPromoCode;
        }),
        concatMap((marketingPromoCode) => this._validatePromoCodeWorkflowService.build({ marketingPromoCode, streaming: false })), // TODO: figure out what to do about that streaming flag
        catchError(() => {
            return throwError('PROMO_CODE_INVALID' as LoadZeroCostCheckoutWorkflowErrors);
        }),
        map((data) => {
            const statusToCheck = data?.status?.toUpperCase();
            if (statusToCheck) {
                if (['REDEEMED'].includes(statusToCheck)) {
                    throw 'PROMO_CODE_USED' as LoadZeroCostCheckoutWorkflowErrors;
                }
                if (['INVALID'].includes(statusToCheck)) {
                    throw 'PROMO_CODE_INVALID' as LoadZeroCostCheckoutWorkflowErrors;
                }
                if (['EXPIRED'].includes(statusToCheck)) {
                    throw 'PROMO_CODE_EXPIRED' as LoadZeroCostCheckoutWorkflowErrors;
                }
            }
            // TODO: add check for expired and invalid promo code
            return data;
        })
    );
    loadOffers$ = this._store.select(getOffersRequestData).pipe(
        take(1),
        concatMap((payload) => this._loadOffersWithCmsContent.build(payload)),
        withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode)),
        tap(([, planCode]) => {
            this._store.dispatch(setSelectedPlanCode({ planCode }));
        }),
        map(() => true)
    );

    build(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'zerocostpromotioncheckout' }));
        return this.collectInboundQueryParams$.pipe(
            concatMap(() => this.validatePromoCode$),
            concatMap(() => this._loadAllPackageDescriptionsWorkflowService.build()),
            concatMap(() => this.loadOffers$),
            tap(() => {
                this._store.dispatch(initTransactionId());
            })
        );
    }
}
