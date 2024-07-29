import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FlepzToTokenLookupCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private _store: Store) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            map(({ dtok, atok, radioid }) => {
                if (dtok || atok || radioid) {
                    return this._router.createUrlTree(['/onboarding', 'setup-credentials', 'tkn-lookup'], { queryParams: route.queryParams });
                } else {
                    return true;
                }
            })
        );
    }
}
