import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { Observable } from 'rxjs';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { concatMap, take } from 'rxjs/operators';
import { getSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
export type LoadPurchaseCombinedPaymentWithQuotesRequest = {
    postalCode: string;
    country: string;
    city: string;
    state: string;
};
@Injectable({ providedIn: 'root' })
export class LoadPurchaseCombinedPaymentWithQuotesDataWorkflowService implements DataWorkflow<LoadPurchaseCombinedPaymentWithQuotesRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService) {}

    build(request: LoadPurchaseCombinedPaymentWithQuotesRequest): Observable<boolean> {
        return this._store.select(getSelectedPlanCode).pipe(
            take(1),
            concatMap((selectedPlancode) =>
                this._loadQuoteWorkflowService.build({
                    planCodes: [selectedPlancode],
                    serviceAddress: request,
                })
            )
        );
    }
}
