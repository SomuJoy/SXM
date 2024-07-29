import { Injectable } from '@angular/core';
import { LoadChangeSubscriptionOffersWorkflowService, getAllOffersUniqueByTerm } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, mapTo, withLatestFrom, catchError } from 'rxjs/operators';
import { getAccountServiceAddressState } from '@de-care/domains/account/state-account';

interface WorkflowRequest {
    subscriptionId: number;
    task?: string;
    province?: string;
    radioId?: string;
    marketingPromoCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadChangeSubscriptionOffersWithCmsContent implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadChangeSubscriptionOffersWorkflowService: LoadChangeSubscriptionOffersWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._loadChangeSubscriptionOffersWorkflowService.build(request).pipe(
            withLatestFrom(this._store.select(getAllOffersUniqueByTerm), this._store.select(getAccountServiceAddressState)),
            concatMap(([_, offers, province]) => {
                const payload = {
                    planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode })),
                    radioId: request.radioId,
                    province,
                };
                return this._loadOffersInfoWorkflowService.build(payload);
            }),
            mapTo(true),
            catchError((err) => {
                return throwError(err);
            })
        );
    }
}
