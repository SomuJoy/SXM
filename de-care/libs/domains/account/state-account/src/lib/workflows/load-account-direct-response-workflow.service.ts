import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountService } from '../data-services/data-account.service';
import { catchError, tap } from 'rxjs/operators';
import { Account } from '../data-services/account.interface';
import { WorkflowRequest } from './load-account-from-account-data-workflow.service';
import { Store } from '@ngrx/store';
import { behaviorEventReactionActiveSubscriptionPlanCodes, behaviorEventReactionCustomerCoreInfo } from '@de-care/shared/state-behavior-events';
import { loadAccountError } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountDirectResponseWorkflowService implements DataWorkflow<WorkflowRequest, Account> {
    constructor(private _dataAccountService: DataAccountService, private readonly _store: Store) {}

    build(request: WorkflowRequest): Observable<Account> {
        return this._dataAccountService.getAccount(request).pipe(
            tap((account) => {
                this._store.dispatch(behaviorEventReactionCustomerCoreInfo(account));
                account.subscriptions?.forEach((sub) => {
                    const plans = sub.plans.map((p) => ({ code: p.code }));
                    this._store.dispatch(behaviorEventReactionActiveSubscriptionPlanCodes({ plans }));
                });
            }),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
