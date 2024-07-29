import { Injectable } from '@angular/core';
import { behaviorEventReactionNumberOfAccountsFound } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import { setRegistrationFlepzLookupAccounts } from './actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions) {}

    behaviorEvents$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(setRegistrationFlepzLookupAccounts),
                flatMap(({ accounts }) => [behaviorEventReactionNumberOfAccountsFound({ accountsFound: accounts?.length })])
            ),
        { dispatch: false }
    );
}
