import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { map, take } from 'rxjs/operators';
import { getTransactionData } from '../state/selectors';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';

export type LoadConfirmationDataWorkflowServiceErrors = 'NO_TRANSACTION_STATE';

@Injectable({ providedIn: 'root' })
export class LoadConfirmationDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._store.select(getTransactionData).pipe(
            take(1),
            map((transactionData) => {
                if (!transactionData) {
                    throw new Error('NO_TRANSACTION_STATE' as LoadConfirmationDataWorkflowServiceErrors);
                }
                if (transactionData?.isEligibleForRegistration) {
                    this._store.dispatch(fetchSecurityQuestions({ accountRegistered: false }));
                }
                this._store.dispatch(pageDataFinishedLoading());
                return true;
            })
        );
    }
}
