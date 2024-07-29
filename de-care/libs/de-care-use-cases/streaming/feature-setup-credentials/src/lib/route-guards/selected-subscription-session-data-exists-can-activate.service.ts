import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { selectedSubscriptionSessionDataExists } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Injectable({ providedIn: 'root' })
export class SelectedSubscriptionSessionDataExistsCanActivateService implements CanActivate {
    constructor(private readonly _store: Store, private _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];
        return this._store.pipe(
            select(selectedSubscriptionSessionDataExists),
            take(1),
            map((sessionDataExists) => (sessionDataExists ? true : this._router.createUrlTree([baseUrl], { queryParams: activatedRouteSnapshot.queryParams })))
        );
    }
}
