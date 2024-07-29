import { Observable } from 'rxjs';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { map, tap, take } from 'rxjs/operators';
import { selectConfirmationData } from '../state/selectors/submit-order.selectors';

@Injectable({ providedIn: 'root' })
export class ConfirmationPageDataWorkflow implements DataWorkflow<void, void> {
    constructor(private readonly _store: Store) {}

    build(): Observable<void> {
        return this._store.select(selectConfirmationData).pipe(
            take(1),
            tap(() => {
                this._store.dispatch(fetchSecurityQuestions({ accountRegistered: false }));
            }),
            map(confirmationData => {
                if (
                    !!confirmationData &&
                    !!confirmationData.maskedUsername &&
                    !!confirmationData.offersData &&
                    !!confirmationData.quotes &&
                    !!confirmationData.registerCompData
                ) {
                    return;
                } else {
                    throw new Error('Missing confirmation data');
                }
            })
        );
    }
}
