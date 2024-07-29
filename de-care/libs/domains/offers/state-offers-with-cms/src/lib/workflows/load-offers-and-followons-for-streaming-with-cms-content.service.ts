import { Injectable } from '@angular/core';
import { LoadOffersWorkflowService, Offer, selectOffer } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';
import { LoadFollowOnOffersForStreamingWorkflowService, selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';

interface WorkflowRequest {
    streaming: boolean;
    student: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    // An optional function to determine if the workflow should call followOn service
    doesOfferNeedFollowOn?: (offer: Offer) => boolean;
}

@Injectable({ providedIn: 'root' })
export class LoadOffersAndFollowOnsForStreamingWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _loadFollowOnOffersForStreamingWorkflowService: LoadFollowOnOffersForStreamingWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        const { doesOfferNeedFollowOn, ...payload } = request;
        return this._loadOffersWorkflowService.build(payload).pipe(
            withLatestFrom(this._store.pipe(select(selectOffer))),
            concatMap(([_, offer]) => {
                let loadFollowOn = true;
                if (doesOfferNeedFollowOn) {
                    loadFollowOn = doesOfferNeedFollowOn(offer);
                }
                return loadFollowOn
                    ? this._loadFollowOnOffersForStreamingWorkflowService.build({ planCode: offer.planCode, province: payload.province }).pipe(mapTo(offer.planCode))
                    : of(offer.planCode);
            }),
            withLatestFrom(this._store.pipe(select(selectFirstFollowOnOfferPlanCode))),
            concatMap(([leadOfferPlanCode, followOnPlanCode]) =>
                this._loadOffersInfoWorkflowService.build({
                    planCodes: [
                        {
                            leadOfferPlanCode,
                            ...(followOnPlanCode && { followOnPlanCode }),
                        },
                    ],
                    province: request.province,
                    radioId: undefined,
                })
            ),
            mapTo(true)
        );
    }
}
