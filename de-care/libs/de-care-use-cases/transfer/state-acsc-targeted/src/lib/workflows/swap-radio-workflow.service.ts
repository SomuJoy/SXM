import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError, of } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { tap, catchError, concatMap, take } from 'rxjs/operators';
import { LoadQuotesForSwapWorkflowService } from './load-quotes-for-swap-workflow.service';
import { getShowQuoteAndPayment } from '../state/selectors/public.selectors';

@Injectable({ providedIn: 'root' })
export class SwapRadioWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _store: Store, private readonly _loadQuotesForSwapWorkflowService: LoadQuotesForSwapWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getShowQuoteAndPayment),
            take(1),
            concatMap((showQuoteAndPayment) => {
                if (showQuoteAndPayment) {
                    return this._loadQuotesForSwapWorkflowService.build().pipe(catchError((error) => throwError(error)));
                } else {
                    return of(true);
                }
            }),
            tap(() => this._store.dispatch(pageDataFinishedLoading())),
            catchError((error) => throwError(error))
        );
    }
}
