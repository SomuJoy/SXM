import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { changeSubscriptionError } from '../state/actions';
import { ChangeSubscriptionResponse, SubscriptionChangeRequest } from '../data-services/change-subscription.interface';
import { DataChangeSubscriptionService } from '../data-services/data-change-subscription.service';
import { isCreditCardError } from '@de-care/shared/de-microservices-common';

export type ChangeSubscriptionWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class ChangeSubscriptionWorkflowService implements DataWorkflow<{ subscriptionId: string; allowErrorHandler: boolean }, ChangeSubscriptionResponse> {
    constructor(private _dataChangeSubscriptionService: DataChangeSubscriptionService, private _store: Store) {}

    build(request, allowErrorHandler = true): Observable<ChangeSubscriptionResponse> {
        return this._dataChangeSubscriptionService.changeSubscription(request, allowErrorHandler).pipe(
            catchError((error) => {
                this._store.dispatch(changeSubscriptionError({ error }));
                if (isCreditCardError(error.status, error?.error?.error?.errorPropKey)) {
                    return throwError('CREDIT_CARD_FAILURE' as ChangeSubscriptionWorkflowServiceError);
                }
                return throwError('SYSTEM' as ChangeSubscriptionWorkflowServiceError);
            })
        );
    }
}
