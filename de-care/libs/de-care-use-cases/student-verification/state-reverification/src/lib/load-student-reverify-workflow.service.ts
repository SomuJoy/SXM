import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadAccountFromTokenWorkflowService, LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { iif, Observable, of } from 'rxjs';
import { catchError, concatMap, mapTo, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

@Injectable({ providedIn: 'root' })
export class LoadStudentReverifyWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private _loadAccountFromTokenForWorkflowService: LoadAccountFromTokenWorkflowService,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _store: Store
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            concatMap(({ tkn }) =>
                iif(
                    () => !!tkn,
                    this._loadAccountFromTokenForWorkflowService.build({
                        token: tkn,
                        isStreaming: true,
                        student: true,
                        allowErrorHandler: false,
                        tokenType: 'SALES_STREAMING',
                    }),
                    this._loadAccountWorkflowService.build({})
                )
            ),
            mapTo(true),
            catchError(() => {
                return of(false);
            })
        );
    }
}
