import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getHasStateDataForSwapConfirmation, getOACLoginRedirectUrl } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { map, withLatestFrom } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class SwapConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}
    canActivate(): Observable<boolean | UrlTree> {
        return this._store.select(getHasStateDataForSwapConfirmation).pipe(
            withLatestFrom(this._store.select(getOACLoginRedirectUrl)),
            map(([hasStateData, oacUrl]) => (hasStateData ? true : this._router.createUrlTree([oacUrl])))
        );
    }
}
