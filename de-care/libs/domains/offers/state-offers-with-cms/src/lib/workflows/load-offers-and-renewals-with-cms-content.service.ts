import { Injectable } from '@angular/core';
import { getFirstOfferPlanCode, getRenewalOffersPlanCodes, LoadOffersWorkflowService, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

interface WorkflowRequest {
    streaming: boolean;
    student: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    renewalCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadOffersAndRenewalsWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build({ renewalCode, ...request }: WorkflowRequest): Observable<boolean> {
        return this._loadOffersWorkflowService.build(request).pipe(
            withLatestFrom(this._store.pipe(select(getFirstOfferPlanCode))),
            map(([_, planCode]) => ({ planCode, renewalCode, streaming: request.streaming, province: request.province })),
            concatMap((renewalRequest) => this._loadRenewalOffersWorkflowService.build(renewalRequest).pipe(mapTo(renewalRequest.planCode))),
            withLatestFrom(this._store.pipe(select(getRenewalOffersPlanCodes))),
            concatMap(([leadOfferPlanCode, renewalPlanCodes]) =>
                this._loadOffersInfoWorkflowService.build({
                    planCodes: [
                        {
                            leadOfferPlanCode,
                            renewalPlanCodes: renewalPlanCodes,
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
