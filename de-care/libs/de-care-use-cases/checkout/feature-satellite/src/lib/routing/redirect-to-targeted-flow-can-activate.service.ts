import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RedirectToTargetedFlowCanActivateService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            map(({ tkn, atok, radioid, dtok, act, lname }) => {
                if (tkn || atok || (radioid && (act || lname)) || dtok) {
                    return this._router.createUrlTree(['/subscribe', 'checkout'], { queryParams: route.queryParams });
                } else {
                    return true;
                }
            })
        );
    }
}
