import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { DataIdentityCustomerEmailService } from '../data-services/data-identity-customer-email.service';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { setAccountPartial } from '../state/actions';

export interface LoadAccountSubscriptionFromEmailWorkflowRequest {
    email: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountSubscriptionFromEmailWorkflowService implements DataWorkflow<LoadAccountSubscriptionFromEmailWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataIdentityCustomerEmailService: DataIdentityCustomerEmailService) {}

    build({ email }: LoadAccountSubscriptionFromEmailWorkflowRequest): Observable<boolean> {
        return this._dataIdentityCustomerEmailService.getAccount({ email }).pipe(
            tap((response) => {
                const account = {
                    subscriptions: response,
                };
                this._store.dispatch(setAccountPartial({ account }));
                // TODO: add behavior tracking
            }),
            mapTo(true)
        );
    }
}
