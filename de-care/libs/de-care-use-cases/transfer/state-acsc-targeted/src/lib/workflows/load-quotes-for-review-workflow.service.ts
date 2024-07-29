import { Injectable } from '@angular/core';
import { LoadACSCQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, mapTo, take, tap, catchError } from 'rxjs/operators';
import { setLoadQuoteDataAsProcessing, setLoadQuoteDataAsNotProcessing } from '../state/actions';
import { getDataForLoadQuotes } from '../state/selectors/choose-payment.selectors';

@Injectable({ providedIn: 'root' })
export class LoadQuotesForReviewWorkflowService implements DataWorkflow<null, null> {
    constructor(private readonly _store: Store, private readonly _loadACSCQuoteWorkflowService: LoadACSCQuoteWorkflowService) {}

    build(): Observable<null> {
        return this._store.pipe(
            select(getDataForLoadQuotes),
            take(1),
            tap(() => this._store.dispatch(setLoadQuoteDataAsProcessing())),
            concatMap(request => {
                return this._loadACSCQuoteWorkflowService.build(request).pipe(
                    tap(() => this._store.dispatch(setLoadQuoteDataAsNotProcessing())),
                    catchError(error => {
                        this._store.dispatch(setLoadQuoteDataAsNotProcessing());
                        return throwError(error);
                    })
                );
            }),
            mapTo(null)
        );
    }
}
