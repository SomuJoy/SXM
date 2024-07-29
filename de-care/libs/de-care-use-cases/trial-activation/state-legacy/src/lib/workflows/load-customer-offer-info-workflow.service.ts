import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { map } from 'rxjs/operators';
import { SetOfferLoadCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { PackageModel } from '@de-care/data-services';

interface WorkflowRequest {
    planCodes: PlanCodeInfo[];
    province: string;
    radioId: string;
    offers: PackageModel[];
}

interface PlanCodeInfo {
    leadOfferPlanCode?: string;
    followOnPlanCode?: string;
    renewalPlanCodes?: string[];
}

@Injectable({ providedIn: 'root' })
export class LoadCustomerOfferInfoWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _setOfferLoadCmsContent: SetOfferLoadCmsContent) {}

    build(request: WorkflowRequest) {
        return this._setOfferLoadCmsContent.build(request).pipe(map(response => response));
    }
}
