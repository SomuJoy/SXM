import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { activeSubscriptionPageReadyForDisplay, getActiveSubscriptionStateDataAvailable } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ActiveSubscriptionFoundCanActivateService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.select(getActiveSubscriptionStateDataAvailable).pipe(
            map((stateDataAvailable) => {
                if (stateDataAvailable) {
                    this._store.dispatch(activeSubscriptionPageReadyForDisplay());
                    return true;
                } else {
                    return this._router.createUrlTree(['error']);
                }
            })
        );
    }
}
