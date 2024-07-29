import { Injectable } from '@angular/core';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { setOffers } from '@de-care/domains/offers/state-offers';

interface WorkflowRequest {
    planCodes: PlanCodeInfo[];
    province: string;
    radioId: string;
    offers: any[];
}

interface PlanCodeInfo {
    leadOfferPlanCode?: string;
    followOnPlanCode?: string;
    renewalPlanCodes?: string[];
}

// Note: this workflow is intended to be a temporary way to set the offer when used in conjunction with a flow that
// did not utilize the store to save the offer in state after making an offers call
// TODO: Remove this workflow once the verify-device-tabs component has been refactored to use the ngrx store
@Injectable({ providedIn: 'root' })
export class SetOfferLoadCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService, private readonly _store: Store) {}

    build(request: WorkflowRequest) {
        this._store.dispatch(setOffers({ offers: request.offers }));
        const { offers, ...infoRequest } = request;
        return this._loadOffersInfoWorkflowService.build(infoRequest).pipe(map(() => true));
    }
}
