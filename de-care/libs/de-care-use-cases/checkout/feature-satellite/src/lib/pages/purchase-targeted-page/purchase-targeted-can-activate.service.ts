import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, convertToParamMap, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadPurchaseDataForTargetedWorkflowErrors, LoadPurchaseDataForTargetedWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PurchaseTargetedCanActivateService implements CanActivate {
    constructor(private readonly _loadPurchaseDataForTargetedWorkflowService: LoadPurchaseDataForTargetedWorkflowService, private readonly _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._loadPurchaseDataForTargetedWorkflowService.build().pipe(
            catchError((error: LoadPurchaseDataForTargetedWorkflowErrors) => {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED': {
                        return of(this._router.createUrlTree(['subscribe/checkout'], { queryParams: activatedRouteSnapshot.queryParams }));
                    }
                    case 'ACCOUNT_NOT_FOUND': {
                        return of(
                            this._router.createUrlTree(['subscribe/checkout/flepz'], {
                                queryParams: {
                                    ...removeQueryParamsFromSet(activatedRouteSnapshot.queryParams, ['tkn', 'token', 'radioid', 'act', 'lname']),
                                },
                            })
                        );
                    }
                    case 'ACTIVE_SATELLITE_SUBSCRIPTION': {
                        // TODO: consider changing this to router.navigate so we can force a URL replacement
                        return of(
                            this._router.createUrlTree([`subscribe/checkout/purchase/satellite/targeted/active-subscription`], {
                                queryParams: routerStateSnapshot.root.queryParams,
                            })
                        );
                    }
                    case 'INVALID_DEVICE': {
                        return of(this._router.createUrlTree([`subscribe/checkout/purchase/satellite/generic-error`]));
                    }
                    default: {
                        return of(this._router.createUrlTree(['error']));
                    }
                }
            })
        );
    }
}

function removeQueryParamsFromSet(queryParams: Params, keysToRemove: string[]): Params {
    const normalizedKeysToRemove = keysToRemove.map((key) => key.toLowerCase());
    const newParams = Object.keys(queryParams).reduce((newSet, nextKey) => {
        if (normalizedKeysToRemove.includes(nextKey.toLowerCase())) {
            return newSet;
        }
        return { ...newSet, [nextKey]: queryParams[nextKey] };
    }, {});
    return newParams;
}
