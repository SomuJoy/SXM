import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { map, take } from 'rxjs/operators';

const NewBuyDigitalRedirectCodes = ['CADISTRPLRTP3FOR1'];

@Injectable({
    providedIn: 'root',
})
export class CheckProgramCodesForNewBuyDigitalRedirect implements CanActivate {
    constructor(private _router: Router, private _store: Store) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            map(({ programcode }) =>
                NewBuyDigitalRedirectCodes.includes(programcode?.toUpperCase())
                    ? this._router.createUrlTree(['/subscribe', 'checkout', 'purchase', 'streaming', 'organic'], { queryParams: route.queryParams })
                    : true
            )
        );
    }
}
