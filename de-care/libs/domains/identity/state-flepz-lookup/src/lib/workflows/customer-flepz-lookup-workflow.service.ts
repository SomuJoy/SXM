import { Injectable } from '@angular/core';
import {
    behaviorEventReactionCustomerFlepzLookupFailure,
    behaviorEventReactionCustomerFlepzLookupReturnedNoSubscriptions,
    behaviorEventReactionCustomerFlepzLookupReturnedSubscriptions,
    behaviorEventReactionCustomerFlepzLookupSuccess
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { CustomerFlepzRequest, CustomerFlepzService } from '../data-services/customer-flepz.service';
import { clearFlepzLookupSubscriptions, setFlepzLookupSubscriptions } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class CustomerFlepzLookupWorkflowService implements DataWorkflow<CustomerFlepzRequest, boolean> {
    constructor(private readonly _customerFlepzService: CustomerFlepzService, private readonly _store: Store) {}

    build(request: CustomerFlepzRequest): Observable<boolean> {
        return this._customerFlepzService.customerFlepz(request).pipe(
            tap(subscriptions => {
                this._store.dispatch(behaviorEventReactionCustomerFlepzLookupSuccess());
                if (Array.isArray(subscriptions) && subscriptions.length > 0) {
                    this._store.dispatch(behaviorEventReactionCustomerFlepzLookupReturnedSubscriptions());
                    this._store.dispatch(setFlepzLookupSubscriptions({ subscriptions }));
                } else {
                    this._store.dispatch(behaviorEventReactionCustomerFlepzLookupReturnedNoSubscriptions());
                    this._store.dispatch(clearFlepzLookupSubscriptions());
                }
            }),
            catchError(error => {
                this._store.dispatch(behaviorEventReactionCustomerFlepzLookupFailure());
                this._store.dispatch(clearFlepzLookupSubscriptions());
                return throwError(error);
            }),
            mapTo(true)
        );
    }
}
