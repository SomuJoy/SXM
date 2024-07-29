import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getHasStateDataForSwapTransaction } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SwapTransactionPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        // TODO: determine where to re-route if no state data (if customer reloads browser while on the swap transaction
        //       page we will not have anything in app state so we need to take them somewhere)
        return this._store.select(getHasStateDataForSwapTransaction).pipe(map((hasStateData) => (hasStateData ? true : this._router.createUrlTree(['./error']))));
    }
}
