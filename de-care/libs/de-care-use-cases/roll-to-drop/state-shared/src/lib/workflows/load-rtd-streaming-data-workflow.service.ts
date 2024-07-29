import { LoadOffersAndRenewalsWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { concatMap, take, tap } from 'rxjs/operators';
import { LoadOffersWorkflowService, getOfferPlanCode, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { behaviorEventReactionForCustomerType, behaviorEventReactionForTransactionType } from '@de-care/shared/state-behavior-events';
import { setProgramCode } from '../state/actions';

interface LoadStreamingDataRequestModel {
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
}
@Injectable({ providedIn: 'root' })
export class LoadRtdStreamingData implements DataWorkflow<LoadStreamingDataRequestModel, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _loadOffersRenewalWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _loadOffersAndRenewalsWithCmsContent: LoadOffersAndRenewalsWithCmsContent
    ) {}

    build(request: LoadStreamingDataRequestModel): Observable<boolean> {
        const province = request?.province || null;
        let offersRequest = { ...request, streaming: true, student: false };
        !!province && (offersRequest = { ...offersRequest, province });

        this._store.dispatch(setProgramCode({ programCode: request?.programCode || null }));

        return this._store.pipe(
            take(1),
            concatMap(() => this._loadOffersAndRenewalsWithCmsContent.build({ ...offersRequest, province })),
            tap(() => {
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SXIR_RTD' }));
                this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'SXIR_RTD' }));
            })
        );
    }

    private _loadOffersAndRenewalsWithoutCmsContent(offersRequest, province) {
        return this._loadOffersWorkflowService.build(offersRequest).pipe(
            concatMap(() => {
                return this._store.pipe(select(getOfferPlanCode), take(1)).pipe(
                    concatMap((planCode) => {
                        return this._loadOffersRenewalWorkflowService.build({
                            planCode,
                            streaming: true,
                            ...(!!province && { province }),
                        });
                    })
                );
            })
        );
    }
}
