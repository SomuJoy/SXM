import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { mapTo, tap } from 'rxjs/operators';
import { AccountVipElegibleRadiosService } from '../data-services/account-vip-eligible-radios.service';
import { setSecondaryStreamingSubscriptions, setSecondarySubscriptions } from '../state/actions';

type LoadAccountSecondarySubscriptionsVipWorkflowParams = {
    accountNumber?: string;
    radioId?: string;
    lastName?: string;
    subscriptionId?: string;
};

@Injectable({ providedIn: 'root' })
export class LoadAccountSecondarySubscriptionsVipWorkflowService implements DataWorkflow<LoadAccountSecondarySubscriptionsVipWorkflowParams, boolean> {
    constructor(private readonly _accountVipElegibleRadiosService: AccountVipElegibleRadiosService, private _store: Store) {}

    build(params) {
        return this._accountVipElegibleRadiosService.getSecondarySubscription(params).pipe(
            tap((response) => {
                this._store.dispatch(setSecondarySubscriptions({ secondarySubscriptions: response?.eligibleSecondarySubscriptions }));
                this._store.dispatch(setSecondaryStreamingSubscriptions({ secondaryStreamingSubscriptions: response?.eligibleSecondaryStreamingSubscriptions }));
            }),
            mapTo(true)
        );
    }
}
