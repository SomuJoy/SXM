import { Injectable } from '@angular/core';
import { LoadSwapRadioQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, mapTo, take, catchError } from 'rxjs/operators';
import { getDataForLoadQuotesInSwap } from '../state/selectors/swap.selectors';

@Injectable({ providedIn: 'root' })
export class LoadQuotesForSwapWorkflowService implements DataWorkflow<null, null> {
    constructor(private readonly _store: Store, private readonly _loadSwapRadioQuoteWorkflowService: LoadSwapRadioQuoteWorkflowService) {}

    build(): Observable<null> {
        return this._store.pipe(
            select(getDataForLoadQuotesInSwap),
            take(1),
            concatMap((request) => {
                return this._loadSwapRadioQuoteWorkflowService.build(request).pipe(catchError((error) => throwError(error)));
            }),
            mapTo(null)
        );
    }
}
