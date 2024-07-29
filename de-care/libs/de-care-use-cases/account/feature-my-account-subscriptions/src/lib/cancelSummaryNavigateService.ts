import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { getAccountNumberAndSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';

@Injectable({ providedIn: 'root' })
export class CancelSummaryNavigateService {
    constructor(private _router: Router, private _store: Store) {}

    goToCancelSummary() {
        return this._store
            .pipe(
                select(getAccountNumberAndSubscriptionId),
                take(1),
                map(({ accountNumber, subscriptionId }) => {
                    this._router.navigate(['subscription', 'cancel'], {
                        queryParams: { accountNumber, subscriptionId },
                    });
                    return EMPTY;
                })
            )
            .subscribe();
    }
}
