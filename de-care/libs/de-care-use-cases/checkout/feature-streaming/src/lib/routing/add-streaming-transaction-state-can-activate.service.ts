import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { getAddStreamingTransactionStateExists } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { GetPageStepRouteConfigurationFromSnapshot } from './page-step-route-configuration';
import { parseUrl } from './redirect-helpers';

@Injectable({
    providedIn: 'root',
})
export class AddStreamingTransactionStateCanActivateService implements CanActivate {
    constructor(private _router: Router, private _store: Store) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<any> {
        return this._store.select(getAddStreamingTransactionStateExists).pipe(
            take(1),
            map((addStreamingTransactionStateExists) => {
                if (!addStreamingTransactionStateExists) {
                    const pageStepRouteConfiguration = GetPageStepRouteConfigurationFromSnapshot(route);
                    const newUrl = parseUrl(state.url, pageStepRouteConfiguration.startOfFlowUrl);
                    this._router.navigate([newUrl], { queryParams: route.queryParams, replaceUrl: true });
                }
                return addStreamingTransactionStateExists;
            })
        );
    }
}
