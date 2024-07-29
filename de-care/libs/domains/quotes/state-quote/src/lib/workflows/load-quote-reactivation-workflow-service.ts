import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, mapTo, tap } from 'rxjs/operators';
import { QuoteModel } from '../data-services/quote.interface';
import { DataQuoteReactivationService } from '../data-services/data-quote-reactivation.service';
import { getInactiveSubscriptionsRadioIds } from '@de-care/domains/account/state-account';
import { setQuote } from '../state/actions';

type domainRequest = Record<string, never>;
@Injectable({ providedIn: 'root' })
export class LoadQuoteReactivationWorkflowService implements DataWorkflow<domainRequest, boolean> {
    constructor(private readonly _dataQuoteReactivationService: DataQuoteReactivationService, private readonly _store: Store) {}
    build(): Observable<boolean> {
        return this._store.select(getInactiveSubscriptionsRadioIds).pipe(
            concatMap((inactiveRadioIds) => (inactiveRadioIds.length > 0 ? this._dataQuoteReactivationService.reactivateQuote() : of({}))),
            tap((response: QuoteModel) => {
                response?.currentQuote && this._store.dispatch(setQuote({ quote: response }));
            }),
            mapTo(true)
        );
    }
}
