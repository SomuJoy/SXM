import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccountCredentialRecoveryUpdatePasswordService } from '../data-services/account-credential-recovery-update-password';

export interface AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest {
    accountLoginCredentials?: boolean;
    password?: string;
    resetKey?: any;
}

@Injectable({ providedIn: 'root' })
export class AccountCredentialRecoveryFromUpdatePasswordWorkflowService implements DataWorkflow<AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest, boolean> {
    constructor(private readonly _accountCredentialRecoveryUpdatePasswordService: AccountCredentialRecoveryUpdatePasswordService) {}

    build(request: AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest): Observable<any> {
        return this._accountCredentialRecoveryUpdatePasswordService.getAccount(request).pipe(
            tap((response) => {
                return response;
            }),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
