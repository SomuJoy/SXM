import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    loadCustomerAccounts,
    setSuccessfulCustomerAccountRequest,
    setFailedCustomerAccountRequest,
    setInvalidPhoneNumberInAccountRequest,
    setAllCustomerAccounts,
    setSystemErrorInAccountRequest,
} from '@de-care/domains/account/state-customer-accounts';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, flatMap, map, mapTo, take, tap } from 'rxjs/operators';
import {
    parsedFlepzDataSubmission,
    setFlepzData,
    setInvalidPhoneInFlepz,
    submitFlepzData,
    submitFlepzDataSettled,
    resetInvalidPhoneInFlepz,
    clearEmailFromFlepzWhenNoAccountFound,
    resetSystemErrorInFlepz,
    setSystemErrorInFlepz,
} from './actions';

@Injectable({
    providedIn: 'root',
})
export class RegistrationFlepzSubmissionEffects {
    constructor(private readonly _actions$: Actions, private readonly _router: Router) {}

    parseFlepzData$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(submitFlepzData),
            map((action) => {
                return parsedFlepzDataSubmission({ flepzData: action.flepzData });
            })
        );
    });

    submitFlepzData$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(parsedFlepzDataSubmission),
            concatMap((action) => {
                return [setFlepzData({ flepzData: action.flepzData }), loadCustomerAccounts({ customerInfo: action.flepzData })];
            })
        );
    });

    submitFailFlepzDataSettled$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(setFailedCustomerAccountRequest),
            map((_) => submitFlepzDataSettled({ hasError: true }))
        );
    });

    systemErrorInFlepzFormDetected$ = createEffect(() => {
        return this._actions$.pipe(ofType(setSystemErrorInAccountRequest), mapTo(setSystemErrorInFlepz()));
    });

    invalidPhoneInFlepzFormDetected$ = createEffect(() => {
        return this._actions$.pipe(ofType(setInvalidPhoneNumberInAccountRequest), mapTo(setInvalidPhoneInFlepz()));
    });

    submitSuccessFlepzDataSettled$ = createEffect(() => {
        return this._actions$.pipe(ofType(setSuccessfulCustomerAccountRequest), mapTo(submitFlepzDataSettled({ hasError: false })));
    });

    resetInvalidPhoneInFlepzForm$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(submitFlepzData),
            flatMap(() => [resetInvalidPhoneInFlepz(), resetSystemErrorInFlepz()])
        );
    });

    redirectOnSuccessfulFlepzSubmission$ = createEffect(
        () => {
            return this._actions$.pipe(
                ofType(submitFlepzData),
                concatMap(() => this._actions$.pipe(ofType(submitFlepzDataSettled), take(1))),
                filter((action) => action.hasError === false),
                tap(() => {
                    this._router.navigate(['/account/registration/verify']);
                })
            );
        },
        { dispatch: false }
    );

    clearEmailIfNoAccountsFound$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAllCustomerAccounts),
            map((action) => action.customerAccounts),
            filter((accounts) => accounts?.length === 0),
            map(() => clearEmailFromFlepzWhenNoAccountFound())
        )
    );
}
