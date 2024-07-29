import { Injectable } from '@angular/core';
import { LoadRenewalOffersWorkflowService, getRenewalOffersPlanCodes } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, mapTo, withLatestFrom } from 'rxjs/operators';

interface WorkflowRequest {
    planCode: string;
    streaming: boolean;
    radioId?: string;
    renewalCode?: string;
    province?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadRenewalOffersWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._loadRenewalOffersWorkflowService.build(request).pipe(
            withLatestFrom(this._store.pipe(select(getRenewalOffersPlanCodes))),
            concatMap(([_, renewalPlanCodes]) =>
                this._loadOffersInfoWorkflowService.build({
                    planCodes: [{ renewalPlanCodes }],
                    radioId: request.radioId,
                    province: request.province
                })
            ),
            mapTo(true)
        );
    }
}
