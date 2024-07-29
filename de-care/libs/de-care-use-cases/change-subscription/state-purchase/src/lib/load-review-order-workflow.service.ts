import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { getRequestDataForQuoteQuery } from './state/selectors/review-order.selectors';
import { setLoadReviewOrderDataAsNotProcessing, setLoadReviewOrderDataAsProcessing } from './state/actions';

@Injectable({ providedIn: 'root' })
export class LoadReviewOrderWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getRequestDataForQuoteQuery),
            take(1),
            map(({ planCodes, subscriptionId }) => ({ planCodes, subscriptionId })),
            tap(() => this._store.dispatch(setLoadReviewOrderDataAsProcessing())),
            concatMap(request =>
                this._loadQuoteWorkflowService.build(request).pipe(
                    tap(() => this._store.dispatch(setLoadReviewOrderDataAsNotProcessing())),
                    catchError(error => {
                        this._store.dispatch(setLoadReviewOrderDataAsNotProcessing());
                        return throwError(error);
                    })
                )
            )
        );
    }
}
