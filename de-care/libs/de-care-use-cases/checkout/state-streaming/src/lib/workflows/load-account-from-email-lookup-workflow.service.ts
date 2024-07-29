import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { getAccountHasActiveStreaming, LoadAccountSubscriptionFromEmailWorkflowService } from '@de-care/domains/account/state-account';
import { catchError, concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import {
    CustomerEmailAsUsernameValidationWorkflowErrors,
    CustomerEmailAsUsernameValidationWorkflowService,
    PasswordValidationWorkflowError,
    PasswordValidationWorkflowService,
} from '@de-care/domains/customer/state-customer-verification';
import { LoadOffersWorkflowService } from './private/load-offers-workflow.service';
import { getRedemptionType } from '../state/selectors';
import { setUserEnteredCredentials } from '@de-care/de-care-use-cases/checkout/state-common';
import { behaviorEventReactionForCustomerType } from '@de-care/shared/state-behavior-events';

export interface LoadAccountFromEmailLookupWorkflowRequest {
    email: string;
    password: string;
}
export interface LoadAccountFromEmailLookupWorkflowError {
    type: 'ACTIVE_STREAMING_SUBSCRIPTION' | 'EMAIL_ERROR_IN_USE' | 'EMAIL_ERROR_INVALID' | 'PASSWORD_ERROR_POLICY' | 'PASSWORD_ERROR_RESERVED_WORD' | 'SYSTEM';
    reservedWord?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountFromEmailLookupWorkflowService implements DataWorkflow<LoadAccountFromEmailLookupWorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _passwordValidationWorkflowService: PasswordValidationWorkflowService,
        private readonly _loadAccountFromEmailWorkflowService: LoadAccountSubscriptionFromEmailWorkflowService,
        private readonly _customerEmailAsUsernameValidationWorkflowService: CustomerEmailAsUsernameValidationWorkflowService,
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService
    ) {}

    build({ email, password }: LoadAccountFromEmailLookupWorkflowRequest): Observable<boolean> {
        const passwordValidate$ = this._passwordValidationWorkflowService.build({ password }).pipe(
            catchError((error: PasswordValidationWorkflowError) => {
                if (error.type === 'RESERVED_WORD') {
                    return throwError({ type: 'PASSWORD_ERROR_RESERVED_WORD', reservedWord: error.reservedWord } as LoadAccountFromEmailLookupWorkflowError);
                }
                return throwError({ type: 'PASSWORD_ERROR_POLICY' } as LoadAccountFromEmailLookupWorkflowError);
            })
        );

        const emailValidate$ = this._customerEmailAsUsernameValidationWorkflowService.build({ email: email, isForStreaming: true, reuseUsername: true }).pipe(
            catchError((error: CustomerEmailAsUsernameValidationWorkflowErrors) => {
                switch (error) {
                    case 'EMAIL_IN_USE_AS_USERNAME': {
                        throw { type: 'EMAIL_ERROR_IN_USE' } as LoadAccountFromEmailLookupWorkflowError;
                    }
                    case 'EMAIL_INVALID': {
                        throw { type: 'EMAIL_ERROR_INVALID' } as LoadAccountFromEmailLookupWorkflowError;
                    }
                    default: {
                        throw { type: 'SYSTEM' } as LoadAccountFromEmailLookupWorkflowError;
                    }
                }
            })
        );

        return passwordValidate$.pipe(
            concatMap(() => this._loadAccountFromEmailWorkflowService.build({ email })),
            withLatestFrom(this._store.select(getAccountHasActiveStreaming)),
            map(([, hasActiveStreaming]) => {
                if (hasActiveStreaming) {
                    throw { type: 'ACTIVE_STREAMING_SUBSCRIPTION' } as LoadAccountFromEmailLookupWorkflowError;
                }
            }),
            concatMap(() => emailValidate$),
            tap(() => {
                this._store.dispatch(setUserEnteredCredentials({ email, password }));
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'NEW_SXIR_ACCOUNT' }));
            }),
            withLatestFrom(this._store.select(getRedemptionType)),
            concatMap(([, redemptionType]) =>
                this._loadOffersWorkflowService.build({
                    redemptionType,
                })
            )
        );
    }
}
