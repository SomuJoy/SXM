import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountConsolidateService } from '../data-services/data-account-consolidate.service';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { behaviorEventReactionAccountConsolidationFailure, behaviorEventReactionAccountConsolidationSuccess } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class ConsolidateAccountWorkflowService implements DataWorkflow<{ trialRadioId: string }, null> {
    constructor(private readonly _store: Store, private readonly _dataAccountConsolidateService: DataAccountConsolidateService) {}

    build(request: { trialRadioId: string }): Observable<null> {
        return this._dataAccountConsolidateService.consolidate(request).pipe(
            tap(_ => {
                this._store.dispatch(behaviorEventReactionAccountConsolidationSuccess());
            }),
            catchError(error => {
                const errorCode = error?.error?.error?.errorCode ?? '';
                this._store.dispatch(behaviorEventReactionAccountConsolidationFailure({ errorMessage: errorCode }));
                return throwError(error);
            })
        );
    }
}
