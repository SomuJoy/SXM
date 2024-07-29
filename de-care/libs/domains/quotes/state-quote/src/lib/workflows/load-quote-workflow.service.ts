import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataQuoteService } from '../data-services/data-quote.service';
import { loadQuoteError, setQuote } from '../state/actions';
import { QuoteRequestModel } from '../data-services/quote-request.interface';
import { behaviorEventReactionQuoteRevenueStatus } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadQuoteWorkflowService implements DataWorkflow<QuoteRequestModel, boolean> {
    constructor(private readonly _dataQuoteService: DataQuoteService, private readonly _store: Store) {}

    build(request: QuoteRequestModel): Observable<boolean> {
        return this._dataQuoteService.quote(request).pipe(
            tap(quote => {
                this._store.dispatch(setQuote({ quote }));
                this._store.dispatch(
                    behaviorEventReactionQuoteRevenueStatus({ revenueStatus: quote.currentQuote && +quote.currentQuote.totalAmount > 0 ? 'Immediate' : 'Deferred' })
                );
            }),
            catchError(error => {
                this._store.dispatch(loadQuoteError({ error }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
