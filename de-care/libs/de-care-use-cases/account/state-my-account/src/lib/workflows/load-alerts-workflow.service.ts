import { Injectable } from '@angular/core';
import { NextBestActionWorkflowService, setAlerts, setNbaActions } from '@de-care/domains/account/state-next-best-actions';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadAlertsWorkflowService {
    constructor(private readonly _nextBestActionWorkflowService: NextBestActionWorkflowService, private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._nextBestActionWorkflowService.build().pipe(
            map((nbaResponse) => {
                this._store.dispatch(setNbaActions({ nbaActions: nbaResponse?.actions }));

                // Temporary filter to only add PAYMENT, SC_AC & PAYMENT_REMINDER type
                const filteredActions = nbaResponse?.actions?.filter(
                    (action) =>
                        action.type === 'PAYMENT' ||
                        action.type === 'SC_AC' ||
                        action.type === 'PAYMENT_REMINDER' ||
                        action.type === 'CONVERT' ||
                        action.type === 'UPGRADE' ||
                        action.type === 'DEVICES' ||
                        action.type === 'CONTENT' ||
                        action.type === 'CREDENTIALS' ||
                        action.type === 'REACTIVATE'
                );

                this._store.dispatch(setAlerts({ alerts: filteredActions }));
                return true;
            }),
            catchError((err) => {
                return throwError(err);
            })
        );
    }
}
