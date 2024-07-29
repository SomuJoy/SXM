import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountCredentialRecoveryValidateKeyService } from '../data-services/account-credential-recovery-validate-key';

export interface AccountCredentialRecoveryFromValidateKeyWorkflowRequest {
    resetKey: string;
}

@Injectable({ providedIn: 'root' })
export class AccountCredentialRecoveryFromValidateKeyWorkflowService implements DataWorkflow<AccountCredentialRecoveryFromValidateKeyWorkflowRequest, boolean> {
    constructor(private readonly _accountCredentialRecoveryValidateKeyService: AccountCredentialRecoveryValidateKeyService) {}

    build(request: AccountCredentialRecoveryFromValidateKeyWorkflowRequest): Observable<any> {
        return this._accountCredentialRecoveryValidateKeyService.getAccount(request).pipe(
            tap((response) => {
                return response;
            }),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
