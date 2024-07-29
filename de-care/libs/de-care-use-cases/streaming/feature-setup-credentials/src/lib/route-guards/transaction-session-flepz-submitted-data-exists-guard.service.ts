import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { transactionSessionFlepzSubmittedDataExists } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TransactionSessionFlepzSubmittedDataExistsGuard implements CanActivate {
    constructor(private readonly _store: Store, private _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];

        return this._store.pipe(
            select(transactionSessionFlepzSubmittedDataExists),
            take(1),
            map((sessionDataExists) => (sessionDataExists ? true : this._router.createUrlTree([baseUrl], { queryParams: activatedRouteSnapshot.queryParams })))
        );
    }
}
