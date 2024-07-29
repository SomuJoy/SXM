import { Inject, Injectable, Optional } from '@angular/core';
import { getAllOffersAsArray, LoadOffersCustomerAddForStreamingWorkflowService } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { USE_LEGACY_OFFER_CONTENT } from '../tokens';
import { AugmentOfferInfoWithRecapDescriptionWorkflow } from './private/augment-offer-info-with-recap-description-workflow.service';

interface WorkflowRequest {
    streaming?: boolean;
    subscriptionId?: number;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    radioId?: string;
    usedCarBrandingType?: string;
    retrieveFallbackOffer?: boolean;
    useCase?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadOffersCustomerAddForStreamingWithCmsContentWorkflow implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersCustomerAddForStreamingWorkflowService: LoadOffersCustomerAddForStreamingWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _augmentOfferInfoWithRecapDescriptionWorkflow: AugmentOfferInfoWithRecapDescriptionWorkflow,
        private readonly _store: Store,
        @Inject(USE_LEGACY_OFFER_CONTENT) @Optional() private readonly _useLegacyOfferContent = false
    ) {}

    build(request: WorkflowRequest) {
        return this._loadOffersCustomerAddForStreamingWorkflowService.build().pipe(
            withLatestFrom(this._store.select(getAllOffersAsArray)),
            map(([_, offers]) => ({
                planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode })),
                province: request?.province,
                radioId: request?.radioId,
            })),
            concatMap((payload) => this._loadOffersInfoWorkflowService.build(payload)),
            concatMap(() => this._augmentOfferInfoWithRecapDescriptionWorkflow.build({ province: request.province })),
            mapTo(true)
        );
    }
}
