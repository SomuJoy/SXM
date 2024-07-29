import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import {
    LoadAccountSubscriptionFromCredentialsRecoveryWorkflowService,
    LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest,
} from '@de-care/domains/identity/state-credentials-recovery';
import { catchError, tap } from 'rxjs/operators';
import { setAccountsData } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromCredentialRecoveryLookupWorkflowService implements DataWorkflow<LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest, boolean> {
    constructor(
        private readonly _loadAccountSubscriptionFromCredentialsRecoveryWorkflowService: LoadAccountSubscriptionFromCredentialsRecoveryWorkflowService,
        private readonly _store: Store
    ) {}

    build(request: LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest): Observable<any> {
        return this._loadAccountSubscriptionFromCredentialsRecoveryWorkflowService.build(request).pipe(
            tap((account) => {
                this._store.dispatch(setAccountsData({ account: account }));
            }),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
