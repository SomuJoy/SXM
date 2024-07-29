import { Injectable } from '@angular/core';
import { LoadAccountNonPiiFromSubscriptionIdWorkflowService } from '@de-care/domains/account/state-account';
import { behaviorEventReactionForCustomerType } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

type AccountFromSubscriptionIdRequest = {
    subscriptionId?: string;
};

@Injectable({
    providedIn: 'root',
})
export class LoadAccountFromSubscriptionIdWorkflowService implements DataWorkflow<AccountFromSubscriptionIdRequest, boolean> {
    constructor(private readonly _loadAccountNonPiiFromSubscriptionIdWorkflowService: LoadAccountNonPiiFromSubscriptionIdWorkflowService, private readonly _store: Store) {}

    build(request: AccountFromSubscriptionIdRequest): Observable<boolean> {
        return this._loadAccountNonPiiFromSubscriptionIdWorkflowService.build(request).pipe(
            tap(() => {
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SXIR_ADD_SUBSCRIPTION' }));
            }),
            mapTo(true)
        );
    }
}
