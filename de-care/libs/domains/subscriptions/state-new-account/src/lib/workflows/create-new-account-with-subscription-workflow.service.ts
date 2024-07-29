import {
    isCreditCardError,
    CreditCardUnexpectedError,
    isPasswordPolicyError,
    PasswordUnexpectedError,
    isPasswordHasPiiDataError,
} from '@de-care/shared/de-microservices-common';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataCreateAccountService } from '../data-services/data-create-account.service';
import { createAccountError, createAccountSuccess } from '../state/actions';
import { CreateAccountRequest } from '../data-services/create-account-request.interfaces';
import { CreateAccountResponse } from '../data-services/create-account-response.interfaces';
import { behaviorEventErrorsFromUserInteraction, behaviorEventReactionNewSubscriptionId } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class CreateNewAccountWithSubscriptionWorkflowService implements DataWorkflow<CreateAccountRequest, CreateAccountResponse> {
    constructor(private readonly _store: Store, private readonly _dataCreateAccountService: DataCreateAccountService) {}

    build(request: CreateAccountRequest): Observable<CreateAccountResponse> {
        return this._dataCreateAccountService.createAccount(request).pipe(
            tap((account) => !!account && this._store.dispatch(createAccountSuccess({ account }))),
            tap((response) =>
                this._store.dispatch(behaviorEventReactionNewSubscriptionId({ id: response && response?.subscriptionId ? response.subscriptionId.toString() : null }))
            ),
            catchError((error) => {
                this._store.dispatch(createAccountError({ error }));
                if (isCreditCardError(error.status, error?.error?.error?.errorPropKey)) {
                    this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Checkout - CC not authorized'] }));
                    return throwError(new CreditCardUnexpectedError('Unexpected Credit Card Error'));
                }
                if (isPasswordPolicyError(error.status, error?.error?.error?.errorPropKey)) {
                    this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Checkout - Invalid password'] }));
                    return throwError(new PasswordUnexpectedError('Unexpected Password Error'));
                }
                if (isPasswordHasPiiDataError(error.status, error?.error?.error?.errorPropKey)) {
                    this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: ['Checkout - Invalid password'] }));
                    return throwError(new PasswordUnexpectedError('Password Has Pii Data Error'));
                }
                return throwError(error);
            })
        );
    }
}
