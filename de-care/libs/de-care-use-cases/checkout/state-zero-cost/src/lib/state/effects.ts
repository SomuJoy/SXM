import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { initTransactionId, setTransactionIdForSession } from './actions';
import * as uuid from 'uuid/v4';
import { flatMap } from 'rxjs/operators';
import { behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions) {}

    initTransactionId$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initTransactionId),
            flatMap(() => {
                const transactionIdForSession = `OAC-${uuid()}`;
                return [setTransactionIdForSession({ transactionIdForSession }), behaviorEventReactionForTransactionId({ transactionId: transactionIdForSession })];
            })
        )
    );
}
