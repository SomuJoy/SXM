import { Injectable } from '@angular/core';
import { getFirstOfferPlanCode, getRenewalOffersPlanCodes, LoadOffersCustomerWorkflowService, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

interface WorkflowRequest {
    streaming: boolean;
    subscriptionId?: number;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    radioId?: string;
    usedCarBrandingType?: string;
    renewalCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadCustomerOffersAndRenewalWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build({ renewalCode, ...request }: WorkflowRequest): Observable<boolean> {
        return this._loadOffersCustomerWorkflowService.build(request).pipe(
            withLatestFrom(this._store.pipe(select(getFirstOfferPlanCode))),
            map(([_, planCode]) => ({ planCode, renewalCode, streaming: request.streaming, radioId: request.radioId, province: request.province })),
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
                    radioId: request.radioId,
                })
            ),
            mapTo(true)
        );
    }
}
