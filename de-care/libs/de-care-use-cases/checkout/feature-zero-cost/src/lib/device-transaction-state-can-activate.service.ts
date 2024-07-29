import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { deviceTransactionStateExists } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { parseUrl } from './parse-url';

@Injectable({
    providedIn: 'root',
})
export class DeviceTransactionStateCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const newUrl = parseUrl(state.url, '../device-lookup');
        return this._store.select(deviceTransactionStateExists).pipe(
            take(1),
            map((transactionStateExists) => {
                if (!transactionStateExists) {
                    this._router.navigate([newUrl], { queryParams: activatedRouteSnapshot.queryParams, replaceUrl: true });
                }
                return transactionStateExists;
            })
        );
    }
}
