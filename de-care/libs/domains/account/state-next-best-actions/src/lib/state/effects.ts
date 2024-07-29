import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, tap } from 'rxjs/operators';
import { NextBestActionWorkflowService } from '../workflows/next-best-action-workflow.service';
import { setAlerts, setNbaActions } from './actions';
import { loadNextBestActionsAsync } from './public-actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store, private readonly _nextBestActionWorkflowService: NextBestActionWorkflowService) {}

    loadNba$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadNextBestActionsAsync),
                concatMap(() => this._nextBestActionWorkflowService.build()),
                tap((nbaResponse) => {
                    this._store.dispatch(setNbaActions({ nbaActions: nbaResponse?.actions }));

                    // Temporary filter to only add PAYMENT, SC_AC & PAYMENT_REMINDER type
                    const filteredActions = nbaResponse?.actions?.filter(
                        (action) =>
                            action.type === 'PAYMENT' ||
                            action.type === 'SC_AC' ||
                            action.type === 'PAYMENT_REMINDER' ||
                            action.type === 'CONVERT' ||
                            action.type === 'UPGRADE' ||
                            action.type === 'DEVICES' ||
                            action.type === 'CONTENT' ||
                            action.type === 'CREDENTIALS' ||
                            action.type === 'REACTIVATE'
                    );

                    this._store.dispatch(setAlerts({ alerts: filteredActions }));
                })
            ),
        { dispatch: false }
    );
}
