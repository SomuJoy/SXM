import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import { LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-satellite';

@Injectable({ providedIn: 'root' })
export class NavigationPurchaseDataTargetedLoadResultsService {
    constructor(private readonly _router: Router) {}

    reRouteForNegativeScenario(error: LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors | unknown, activatedRouteSnapshot: ActivatedRouteSnapshot): void {
        switch (error) {
            case 'LEGACY_FLOW_REQUIRED': {
                this._router.navigate(['/subscribe/checkout'], { replaceUrl: true, queryParams: activatedRouteSnapshot.queryParams });
                break;
            }
            case 'ACCOUNT_NOT_FOUND': {
                this._router.navigate(['/subscribe/checkout/flepz'], {
                    queryParams: {
                        ...removeQueryParamsFromSet(activatedRouteSnapshot.queryParams, ['tkn', 'token', 'radioid', 'act', 'lname']),
                    },
                });
                break;
            }
            case 'ACTIVE_SATELLITE_SUBSCRIPTION': {
                this._router.navigate(['subscribe/checkout/purchase/satellite/targeted/active-subscription'], {
                    replaceUrl: true,
                    queryParams: activatedRouteSnapshot.queryParams,
                });
                break;
            }
            case 'INVALID_DEVICE': {
                this._router.navigate(['subscribe/checkout/purchase/satellite/generic-error']);
                break;
            }
            case 'SYSTEM':
            default: {
                this._router.navigate(['/error'], { replaceUrl: true });
            }
        }
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
