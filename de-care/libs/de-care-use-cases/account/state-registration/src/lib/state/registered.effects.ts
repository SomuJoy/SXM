import { Injectable } from '@angular/core';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { accountAlreadyRegisteredGoToLogin } from './actions';

@Injectable()
export class RegisteredEffects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}

    routeToLogin$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(accountAlreadyRegisteredGoToLogin),
                withLatestFrom(this._store.select(getIsCanadaMode)),
                tap(([action, isCanada]) => (window.location.href = isCanada ? 'http://care.siriusxm.ca/' : 'http://care.siriusxm.com/'))
            ),
        { dispatch: false }
    );
}
