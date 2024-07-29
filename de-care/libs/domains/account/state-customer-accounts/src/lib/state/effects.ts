import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
import { CustomerAccountFlepzService } from '../data-services/customer-accounts-flepz.service';
import { CustomerAccountsListRequest } from '../data-services/customer-accounts-list.interface';
import {
    loadCustomerAccounts,
    setAllCustomerAccounts,
    setSuccessfulCustomerAccountRequest,
    setFailedCustomerAccountRequest,
    setInvalidPhoneNumberInAccountRequest,
    setSystemErrorInAccountRequest,
} from './actions';
import { behaviorEventReactionNumberOfAccountsFound } from '@de-care/shared/state-behavior-events';

@Injectable()
export class CustomerAccountsEffects {
    constructor(private _actions$: Actions, private _customerAccountFlepzService: CustomerAccountFlepzService) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadCustomerAccounts),
            concatMap((action) => this._fetchCustomerAccounts({ ...action.customerInfo }))
        )
    );

    trackNumberOfAccounts = createEffect(() =>
        this._actions$.pipe(
            ofType(setAllCustomerAccounts),
            filter((action) => Array.isArray(action.customerAccounts) && action.customerAccounts?.length > 0),
            map((action) => action.customerAccounts?.length),
            map((accountsFound) => behaviorEventReactionNumberOfAccountsFound({ accountsFound }))
        )
    );

    invalidPhoneInAccountRequestEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setFailedCustomerAccountRequest),
            map((action) => action.errorCode),
            map((errorCode) => {
                if (errorCode === 'PHONE_INVALID') {
                    return setInvalidPhoneNumberInAccountRequest();
                } else {
                    return setSystemErrorInAccountRequest();
                }
            })
        )
    );

    private _fetchCustomerAccounts(customerInfo: CustomerAccountsListRequest) {
        return this._customerAccountFlepzService.fetchCustomerAccounts(customerInfo).pipe(
            concatMap((accountsList) => [setAllCustomerAccounts({ customerAccounts: accountsList }), setSuccessfulCustomerAccountRequest()]),
            catchError((error) => {
                return of(setFailedCustomerAccountRequest({ errorCode: this._getErrorCode(error) }));
            })
        );
    }

    private _getErrorCode(error): string {
        const fieldErrors = error?.error?.error?.fieldErrors;
        if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            return fieldErrors[0].errorCode;
        }
        return null;
    }
}
