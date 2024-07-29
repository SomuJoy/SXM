import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountService } from '../data-services/data-account.service';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { loadAccountError, setAccount } from '../state/actions';
import { Account } from '../data-services/account.interface';
import { behaviorEventReactionForAccountAddressesState } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadAccountWorkflowService implements DataWorkflow<{ accountNumber: string }, Account> {
    constructor(private _dataAccountService: DataAccountService, private _store: Store) {}

    build(request): Observable<Account> {
        return this._dataAccountService.getAccount(request).pipe(
            tap((account) => this._store.dispatch(setAccount({ account }))),
            tap((account) => {
                const serviceAddressState = account?.serviceAddress?.state;
                const billingAddressState = account?.billingAddress?.state;
                this._store.dispatch(behaviorEventReactionForAccountAddressesState({ serviceAddressState, billingAddressState }));
            }),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
