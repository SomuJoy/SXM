import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { addSubscriptionError } from '../state/actions';
import { AddSubscriptionResponse } from '../data-services/add-subscription.interface';
import { DataAddSubscriptionService } from '../data-services/data-add-subscription.service';
import { CreditCardUnexpectedError, isCreditCardError } from '@de-care/shared/de-microservices-common';
export type AddSubscriptionWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class AddSubscriptionWorkflowService implements DataWorkflow<{ subscriptionId: string; allowErrorHandler: boolean }, AddSubscriptionResponse> {
    constructor(private _dataAddSubscriptionService: DataAddSubscriptionService, private _store: Store) {}
    build(request, allowErrorHandler = true): Observable<AddSubscriptionResponse> {
        return this._dataAddSubscriptionService.addSubscription(request, allowErrorHandler).pipe(
            catchError((error) => {
                this._store.dispatch(addSubscriptionError({ error }));
                if (isCreditCardError(error.status, error?.error?.error?.errorPropKey)) {
                    return throwError(new CreditCardUnexpectedError('Unexpected Credit Card Error'));
                }
                return throwError(error);
            })
        );
    }
}
