import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap, withLatestFrom, mapTo } from 'rxjs/operators';
import { setSelectedSubscriptionId } from '../state/actions';
import { getIsClosedRadio, getAccountFirstSubscription, getFirstClosedDeviceFromAccount } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class SetSelectedSubscriptionIdWorkflowService implements DataWorkflow<null, null> {
    constructor(private readonly _store: Store) {}
    build(): Observable<null> {
        return this._store.pipe(
            select(getIsClosedRadio),
            withLatestFrom(this._store.pipe(select(getAccountFirstSubscription)), this._store.pipe(select(getFirstClosedDeviceFromAccount))),
            tap(([isClosedRadio, firstSubscription, closedSubscription]) => {
                if (isClosedRadio) {
                    this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: +closedSubscription.subscription.id }));
                } else {
                    this._store.dispatch(setSelectedSubscriptionId({ selectedSubscriptionId: +firstSubscription.id }));
                }
            }),
            mapTo(null)
        );
    }
}
