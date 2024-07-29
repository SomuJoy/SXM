import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { cancelSubscriptionError } from '../state/actions';
import { Cancellation } from '../data-services/cancellation.interface';
import { DataCancellationService } from '../data-services/data-cancellation.service';

@Injectable({ providedIn: 'root' })
export class CancelSubscriptionWorkflowService implements DataWorkflow<{ subscriptionId: string; inAuthId: string }, Cancellation> {
    constructor(private _dataCancellationService: DataCancellationService, private _store: Store) {}

    build(request): Observable<Cancellation> {
        return this._dataCancellationService.cancelSubscription(request).pipe(
            catchError(error => {
                this._store.dispatch(cancelSubscriptionError({ error }));
                return throwError(error);
            })
        );
    }
}
