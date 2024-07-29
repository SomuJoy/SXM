import { Injectable } from '@angular/core';
import {
    AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest,
    AccountCredentialRecoveryFromUpdatePasswordWorkflowService,
} from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountCredentialRecoveryFromUpdatePasswordLookupWorkflowService implements DataWorkflow<AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest, boolean> {
    constructor(private readonly _accountCredentialRecoveryFromUpdatePasswordWorkflowService: AccountCredentialRecoveryFromUpdatePasswordWorkflowService) {}

    build(request: AccountCredentialRecoveryFromUpdatePasswordWorkflowRequest): Observable<any> {
        return this._accountCredentialRecoveryFromUpdatePasswordWorkflowService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
