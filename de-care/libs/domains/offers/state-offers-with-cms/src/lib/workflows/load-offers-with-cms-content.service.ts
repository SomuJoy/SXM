import { Injectable } from '@angular/core';
import { LoadOffersWorkflowService, getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, mapTo, withLatestFrom, map } from 'rxjs/operators';
import { AugmentOfferInfoWithRecapDescriptionWorkflow } from './private/augment-offer-info-with-recap-description-workflow.service';

interface WorkflowRequest {
    streaming: boolean;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    usedCarBrandingType?: string;
    retrieveFallbackOffer?: boolean;
    useCase?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadOffersWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _augmentOfferInfoWithRecapDescriptionWorkflow: AugmentOfferInfoWithRecapDescriptionWorkflow,
        private readonly _store: Store
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._loadOffersWorkflowService.build(request).pipe(
            withLatestFrom(this._store.select(getAllOffersAsArray)),
            map(([_, offers]) => ({
                planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode })),
                province: request.province,
                radioId: undefined,
            })),
            concatMap((payload) => this._loadOffersInfoWorkflowService.build(payload)),
            concatMap(() => this._augmentOfferInfoWithRecapDescriptionWorkflow.build({ province: request.province })),
            mapTo(true)
        );
    }
}
