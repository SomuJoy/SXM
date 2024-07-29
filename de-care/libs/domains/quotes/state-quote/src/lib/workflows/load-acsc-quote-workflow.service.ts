import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ACSCQuoteRequestModel, DataACSCQuoteService } from '../data-services/data-acsc-quote.service';
import { loadQuoteError, setQuote } from '../state/actions';
import { behaviorEventReactionAcscQuoteFailure } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadACSCQuoteWorkflowService implements DataWorkflow<ACSCQuoteRequestModel, boolean> {
    constructor(private readonly _dataACSCQuoteService: DataACSCQuoteService, private readonly _store: Store) {}

    build(request: ACSCQuoteRequestModel): Observable<boolean> {
        return this._dataACSCQuoteService.quote(request).pipe(
            tap(quote => this._store.dispatch(setQuote({ quote }))),
            catchError(error => {
                this._store.dispatch(loadQuoteError({ error }));
                const errorCode = error?.error?.error?.errorCode ?? '';
                this._store.dispatch(behaviorEventReactionAcscQuoteFailure({ errorMessage: errorCode }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
