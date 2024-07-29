import { Injectable } from '@angular/core';
import { AccountCredentialRecoveryFromValidateKeyWorkflowRequest, AccountCredentialRecoveryFromValidateKeyWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { setResetTokenUserName } from '../state/public.actions';

@Injectable({ providedIn: 'root' })
export class AccountCredentialRecoveryFromValidateKeyLookupWorkflowService implements DataWorkflow<AccountCredentialRecoveryFromValidateKeyWorkflowRequest, boolean> {
    constructor(
        private readonly _accountCredentialRecoveryFromValidateKeyWorkflowService: AccountCredentialRecoveryFromValidateKeyWorkflowService,
        private readonly _store: Store
    ) {}

    build(request: AccountCredentialRecoveryFromValidateKeyWorkflowRequest): Observable<any> {
        return this._accountCredentialRecoveryFromValidateKeyWorkflowService.build(request).pipe(
            tap((response) => {
                this._store.dispatch(setResetTokenUserName({ userName: response?.sxmUsername }));
            }),
            mapTo(true),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
