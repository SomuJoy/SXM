import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataQuoteService } from '../data-services/data-quote.service';
import { loadQuote, loadQuoteError, setQuote } from './actions';

@Injectable()
export class LoadQuoteEffectsService {
    constructor(private _actions$: Actions, private readonly _dataQuoteService: DataQuoteService) {}

    loadQuote$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadQuote),
            mergeMap(({ request }) =>
                this._dataQuoteService.quote(request).pipe(
                    map(quote => setQuote({ quote })),
                    catchError(error => of(loadQuoteError({ error })))
                )
            )
        )
    );
}
