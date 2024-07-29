import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SwapRadioQuoteRequestModel, DataSwapRadioQuoteService } from '../data-services/data-swap-radio-quote.service';
import { loadQuoteError, setQuote } from '../state/actions';
import { behaviorEventReactionAcscQuoteFailure } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadSwapRadioQuoteWorkflowService implements DataWorkflow<SwapRadioQuoteRequestModel, boolean> {
    constructor(private readonly _dataACSCQuoteService: DataSwapRadioQuoteService, private readonly _store: Store) {}

    build(request: SwapRadioQuoteRequestModel): Observable<boolean> {
        return this._dataACSCQuoteService.quote(request).pipe(
            tap((response) => this._store.dispatch(setQuote({ quote: response.quote }))),
            catchError((error) => {
                this._store.dispatch(loadQuoteError({ error }));
                this._store.dispatch(behaviorEventReactionAcscQuoteFailure({ errorMessage: error?.errorCode ?? '' }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
