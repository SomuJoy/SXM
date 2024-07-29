import { CanActivate, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { getFirstAccountSubscription, getQuote, selectOffer } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';

@Injectable({
    providedIn: 'root',
})
export class RollOverCompleteGuard implements CanActivate {
    constructor(private _router: Router, private _store: Store) {}

    canActivate() {
        return combineLatest([this._store.pipe(select(selectOffer)), this._store.pipe(select(getFirstAccountSubscription)), this._store.pipe(select(getQuote))]).pipe(
            take(1),
            map(([offer, subscription, quote]) => {
                if (!offer || !subscription || !quote) {
                    return this._goToError();
                }
                return true;
            })
        );
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'error']);
    }
}
