import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { setLoadYourInfoDataAsNotProcessing, setLoadYourInfoDataAsProcessing } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { getRequestDataForQuoteWithoutServiceAddress } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadReviewOrderTokenizedWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getRequestDataForQuoteWithoutServiceAddress),
            take(1),
            map(({ planCode, renewalPlanCode }) => ({ planCodes: [planCode], renewalPlanCode })),
            tap(() => this._store.dispatch(setLoadYourInfoDataAsProcessing())),
            concatMap(request =>
                this._loadQuoteWorkflowService.build(request).pipe(
                    tap(() => this._store.dispatch(setLoadYourInfoDataAsNotProcessing())),
                    catchError(error => {
                        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                        return throwError(error);
                    })
                )
            )
        );
    }
}
