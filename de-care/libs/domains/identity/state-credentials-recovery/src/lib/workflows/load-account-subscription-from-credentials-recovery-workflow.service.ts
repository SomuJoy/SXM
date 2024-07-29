import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataIdentityCustomerCredentialsRecoveryService } from '../data-services/data-identity-customer-credentials-recovery.service';
import { clearCredentialsRecoveryAccounts, setCredentialsRecoveryAccounts } from '../state/actions';

export interface LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest {
    emailOrUsername?: string;
    source?: string;
    accountNumber?: any;
    radioId?: any;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountSubscriptionFromCredentialsRecoveryWorkflowService implements DataWorkflow<LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest, any> {
    constructor(private readonly _store: Store, private readonly _dataIdentityCustomerCredentialsRecoveryService: DataIdentityCustomerCredentialsRecoveryService) {}

    build(request: LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest): Observable<any> {
        return this._dataIdentityCustomerCredentialsRecoveryService.getAccount(request).pipe(
            tap((accounts) => {
                if (Array.isArray(accounts) && accounts.length > 0) {
                    this._store.dispatch(setCredentialsRecoveryAccounts({ accounts }));
                } else {
                    this._store.dispatch(clearCredentialsRecoveryAccounts());
                }
            }),
            // TODO: change this to map to boolean
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
