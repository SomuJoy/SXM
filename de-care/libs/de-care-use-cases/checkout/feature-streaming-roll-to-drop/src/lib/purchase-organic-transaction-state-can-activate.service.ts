import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { organicTransactionStateExists } from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GetPageStepRouteConfigurationFromSnapshot } from './page-step-route-configuration';
import { parseUrl } from './redirect-helpers';

@Injectable({
    providedIn: 'root',
})
export class PurchaseOrganicTransactionStateCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<any> {
        return this._store.select(organicTransactionStateExists).pipe(
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
