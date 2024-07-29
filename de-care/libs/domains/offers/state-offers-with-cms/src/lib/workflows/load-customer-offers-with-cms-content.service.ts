import { Inject, Injectable, Optional } from '@angular/core';
import { LoadOffersCustomerWorkflowService, getAllOffersAsArray, selectOffer, Offer } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { USE_LEGACY_OFFER_CONTENT } from '../tokens';
import { LoadFollowOnOffersForStreamingWorkflowService, selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';

interface WorkflowRequest {
    streaming: boolean;
    subscriptionId?: number;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    radioId?: string;
    usedCarBrandingType?: string;
    retrieveFallbackOffer?: boolean;
    redemptionType?: string;
    useCase?: string;
    doesOfferNeedFollowOn?: (offer: Offer) => boolean;
}

export type LoadCustomerOffersWithCmsContentError = 'NO_OFFERS_PRESENTED';

@Injectable({ providedIn: 'root' })
export class LoadCustomerOffersWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _loadFollowOnOffersForStreamingWorkflowService: LoadFollowOnOffersForStreamingWorkflowService,
        private readonly _store: Store,
        @Inject(USE_LEGACY_OFFER_CONTENT) @Optional() private readonly _useLegacyOfferContent = false
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        const { doesOfferNeedFollowOn, ...payload } = request;
        return this._loadOffersCustomerWorkflowService.build(payload).pipe(
            withLatestFrom(this._store.pipe(select(selectOffer))),
            concatMap(([_, offer]) => {
                if (!offer) {
                    return throwError('NO_OFFERS_PRESENTED' as LoadCustomerOffersWithCmsContentError);
                }
                let loadFollowOn = false;
                //TODO: We need to figure out a better implementation, in order to avoid this method bien sent as request params
                if (doesOfferNeedFollowOn) {
                    loadFollowOn = doesOfferNeedFollowOn(offer);
                }
                return loadFollowOn
                    ? this._loadFollowOnOffersForStreamingWorkflowService.build({ planCode: offer.planCode, province: payload.province }).pipe(mapTo(offer.planCode))
                    : of(offer.planCode);
            }),
            withLatestFrom(this._store.pipe(select(selectFirstFollowOnOfferPlanCode)), this._store.select(getAllOffersAsArray)),
            map(([_, followOnPlanCode, offers]) => ({
                planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode, ...(followOnPlanCode && { followOnPlanCode }) })),
                province: request.province,
                radioId: request.radioId,
            })),
            concatMap((payload) => this._loadOffersInfoWorkflowService.build(payload)),
            mapTo(true)
        );
    }
}
