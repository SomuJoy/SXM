import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { fetchVerificationMethods, fetchVerificationOptionsCompleted, setVerificationMethods, twoFactorAuthDataNeeded } from '../actions/actions';
import { GetVerifyOptionsWorkflow } from '../workflows/get-verify-options.workflow';
import { getCheckoutAccountState } from '../selectors/selectors';

@Injectable({
    providedIn: 'root'
})
export class VerifyOptionsEffect {
    constructor(
        private readonly _actions$: Actions,
        private readonly _getVerifyOptionsWorkflow: GetVerifyOptionsWorkflow,
        private readonly _store: Store,
        private readonly _router: Router
    ) {}

    isTwoFactorNeeded$ = createEffect(() =>
        this._actions$.pipe(
            ofType(twoFactorAuthDataNeeded),
            withLatestFrom(this._store.select(getCheckoutAccountState)),
            map(([action, { last4DigitsOfAccountNumber: lastFourOfAccountNumber }]) => fetchVerificationMethods({ lastFourOfAccountNumber }))
        )
    );

    verifyOptions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchVerificationMethods),
            switchMap(({ lastFourOfAccountNumber }) =>
                this._getVerifyOptionsWorkflow.build(lastFourOfAccountNumber).pipe(map(status => fetchVerificationOptionsCompleted({ hasError: !status })))
            )
        )
    );

    fetchVerifyOptionsCompletedWithoutError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setVerificationMethods),
            map(() => fetchVerificationOptionsCompleted({ hasError: false }))
        )
    );

    verifyOptionsError$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(fetchVerificationOptionsCompleted),
                map(hasError => hasError && this._router.createUrlTree(['/error']))
            ),
        { dispatch: false }
    );
}
