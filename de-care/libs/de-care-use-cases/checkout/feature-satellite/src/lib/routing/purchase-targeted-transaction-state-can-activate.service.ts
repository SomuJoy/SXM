import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { targetedTransactionStateExists } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GetPageStepRouteConfigurationFromSnapshot } from './page-step-route-configuration';

@Injectable({
    providedIn: 'root',
})
export class PurchaseTargetedTransactionStateCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<any> {
        return this._store.select(targetedTransactionStateExists).pipe(
            take(1),
            map((transactionStateExists) => {
                if (!transactionStateExists) {
                    const pageStepRouteConfiguration = GetPageStepRouteConfigurationFromSnapshot(activatedRouteSnapshot);
                    const newUrl = parseUrl(state.url, pageStepRouteConfiguration.startOfFlowUrl);
                    this._router.navigate([newUrl], { queryParams: activatedRouteSnapshot.queryParams, replaceUrl: true });
                }
                return transactionStateExists;
            })
        );
    }
}

// TODO: Move this to a common util location somewhere so it can be used anytime we need to deal with a relative URL route in an CanActivate guard
function parseUrl(url: string, redirectTo: string) {
    const urlTokens = url.split('/');
    const redirectToTokens = redirectTo.split('/');
    let token = redirectToTokens.shift();
    while (token) {
        if (token !== '.' && token !== '..') {
            redirectToTokens.unshift(token);
            break;
        }
        if (token === '..') {
            urlTokens.pop();
        }
        token = redirectToTokens.shift();
    }
    urlTokens.push(...redirectToTokens);
    return urlTokens.join('/');
}
