import { Injectable } from '@angular/core';
import { Observable, combineLatest, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { getSubscriptionId, getPlanType, getTransactionId } from '../state/selectors/state.selectors';
import { setCancellationDetails, setWillBeCancelledLaterToTrue } from '../state/actions';
import { CancelSubscriptionWorkflowService } from '@de-care/domains/cancellation/state-cancellation';
import { Router } from '@angular/router';
import { SessionTimeoutHttpError } from '@de-care/shared/de-microservices-common';

@Injectable({ providedIn: 'root' })
export class ProcessCancelConfirmationWorkflowService implements DataWorkflow<null, any> {
    constructor(private readonly _cancelSubscriptionWorkflowService: CancelSubscriptionWorkflowService, private readonly _store: Store, private readonly _router: Router) {}
    build(): Observable<any> {
        return combineLatest([this._store.pipe(select(getSubscriptionId)), this._store.pipe(select(getPlanType)), this._store.pipe(select(getTransactionId))]).pipe(
            take(1),
            concatMap(([subscriptionId, planType, transactionId]) => {
                return this._cancelSubscriptionWorkflowService.build({ subscriptionId, inAuthId: transactionId }).pipe(
                    tap(() => {
                        if (planType === 'TRIAL') {
                            this._store.dispatch(setWillBeCancelledLaterToTrue());
                        }
                    }),
                    map(cancellation => {
                        this._store.dispatch(setCancellationDetails({ cancellationDetails: cancellation }));
                    }),
                    catchError(error => {
                        if (error instanceof SessionTimeoutHttpError) {
                            return throwError(error);
                        } else {
                            this._router.navigate(['/error']);
                        }
                    })
                );
            })
        );
    }
}
