import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of, throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { AccountProfileService } from '@de-care/domains/account/state-account';
import { getAccountProfileRequest, selectBeatTheSoldAndStepUp } from '../selectors';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { behaviorEventReactionActiveSubscriptionPlanCodes } from '@de-care/shared/state-behavior-events';
import { getAccountProfileSuccess, registrationDataReady, resetAccountNotFoundLinkClick, validateUserName } from '../actions';

export type LoadRegistrationWorkflowServiceErrors = 'ACCOUNT_NOT_IN_SESSION' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadRegistrationWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _accountProfileService: AccountProfileService, private readonly _store: Store) {}

    build() {
        return this._store.pipe(
            select(selectBeatTheSoldAndStepUp),
            take(1),
            tap(() => this._store.dispatch(fetchSecurityQuestions({ accountRegistered: false }))),
            tap(() => this._store.dispatch(validateUserName())),
            concatMap((flags) => (flags.beatTheSold ? this._handleInBeatTheSold() : flags.stepUp ? this._handleInStepUp() : this._handleRegistration())),
            mapTo(true),
            catchError((error) => {
                if (error === 'ACCOUNT_NOT_IN_SESSION') {
                    return throwError(error);
                } else {
                    throw 'SYSTEM' as LoadRegistrationWorkflowServiceErrors;
                }
            })
        );
    }

    private _handleInBeatTheSold(): Observable<boolean> {
        this._store.dispatch(behaviorEventReactionActiveSubscriptionPlanCodes({ plans: [{ code: 'DEMO' }] }));
        return of(true);
    }

    private _handleInStepUp(): Observable<boolean> {
        this._store.dispatch(registrationDataReady());
        return of(true);
    }

    private _handleRegistration(): Observable<boolean> {
        this._store.dispatch(resetAccountNotFoundLinkClick());
        return this._store.select(getAccountProfileRequest).pipe(
            take(1),
            concatMap(({ last4DigitsOfAccountNumber: accountNumber }) =>
                this._accountProfileService.getAccountProfile({ accountNumber }).pipe(
                    map((response) => {
                        this._store.dispatch(getAccountProfileSuccess({ response }));
                        return of(true);
                    })
                )
            ),
            mapTo(true),
            catchError((error) => {
                if (error?.error?.error?.errorCode === 'ACCOUNT_NOT_IN_SESSION') {
                    throw 'ACCOUNT_NOT_IN_SESSION' as LoadRegistrationWorkflowServiceErrors;
                }
                throw 'SYSTEM' as LoadRegistrationWorkflowServiceErrors;
            })
        );
    }
}
