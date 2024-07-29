import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getAccountSubscriptions, setSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';
import { loadModifySubscriptionOptionsForSubscriptionId } from '@de-care/domains/account/state-management';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

@Injectable({ providedIn: 'root' })
export class CheckSubscriptionDetailsReadyWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _store: Store) {}

    build(): Observable<boolean> {
        return combineLatest([this._store.select(getNormalizedQueryParams), this._store.select(getAccountSubscriptions)]).pipe(
            take(1),
            map(([{ subscriptionid }, subscriptions]) => {
                if (subscriptionid) {
                    this._store.dispatch(pageDataFinishedLoading());
                    const subscriptionExists = subscriptions?.some((subscription) => (subscription.id === subscriptionid ? true : false));
                    if (subscriptionExists) {
                        this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: subscriptionid }));
                        this._store.dispatch(loadModifySubscriptionOptionsForSubscriptionId({ subscriptionId: +subscriptionid }));
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            })
        );
    }
}
