import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionActiveSubscriptionServiceId } from '@de-care/shared/state-behavior-events';
import { getAccountServiceId } from '../selectors';
import { setAccount } from '../actions';

@Injectable()
export class ActiveSubscriptionServiceIdEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            withLatestFrom(this._store.pipe(select(getAccountServiceId))),
            map(([_, id]) => behaviorEventReactionActiveSubscriptionServiceId({ id }))
        )
    );
}
