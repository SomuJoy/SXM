import { Injectable } from '@angular/core';
import {
    getAllOffersAsArray,
    getRenewalOffersPlanCodes,
    LoadOffersCustomerWorkflowService,
    LoadRenewalOffersWorkflowService,
    Offer,
} from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

interface WorkflowRequest {
    streaming: boolean;
    shouldLoadRenewals: (offer: Offer) => boolean;
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
export class LoadCustomerOffersAndConditionallyRenewalWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build({ renewalCode, ...request }: WorkflowRequest): Observable<boolean> {
        return this._loadOffersCustomerWorkflowService.build(request).pipe(
            withLatestFrom(this._store.select(getAllOffersAsArray)),
            // this is going to determine according request if we need to load the renewals
            concatMap(([, offers]) => {
                const loadRenewalOffers = request.shouldLoadRenewals(offers[0]);
                if (loadRenewalOffers) {
                    return this._loadRenewalOffersWorkflowService
                        .build({ planCode: offers[0].planCode, renewalCode, streaming: request.streaming, radioId: request.radioId })
                        .pipe(
                            withLatestFrom(this._store.pipe(select(getRenewalOffersPlanCodes))),
                            map(([, renewalPlanCodes]) => ({
                                planCodes: [
                                    {
                                        leadOfferPlanCode: offers[0].planCode,
                                        renewalPlanCodes: renewalPlanCodes,
                                    },
                                ],
                                province: request.province,
                                radioId: request.radioId,
                            }))
                        );
                }
                return of({
                    planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode })),
                    province: request.province,
                    radioId: request.radioId,
                });
            }),
            concatMap((payload) => {
                return this._loadOffersInfoWorkflowService.build(payload);
            }),
            mapTo(true)
        );
    }
}
