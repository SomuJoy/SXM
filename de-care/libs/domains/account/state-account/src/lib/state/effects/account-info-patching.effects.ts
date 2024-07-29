import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { patchAccountUsername, patchPrimarySubscriptionUsername } from '../actions';

@Injectable()
export class AccountInfoPatchingEffects {
    constructor(private _actions$: Actions) {}

    patchPrimarySubscriptionUsername$ = createEffect(() =>
        this._actions$.pipe(
            ofType(patchAccountUsername),
            map((action) => patchPrimarySubscriptionUsername({ userName: action.userName }))
        )
    );
}
