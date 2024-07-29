import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionActiveSubscriptionRadioId } from '@de-care/shared/state-behavior-events';
import { getAccountRadioServiceRadioIdLast4 } from '../selectors';
import { setAccount } from '../actions';

@Injectable()
export class ActiveSubscriptionRadioIdEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            withLatestFrom(this._store.pipe(select(getAccountRadioServiceRadioIdLast4))),
            map(([_, radioId]) => behaviorEventReactionActiveSubscriptionRadioId({ radioId }))
        )
    );
}
