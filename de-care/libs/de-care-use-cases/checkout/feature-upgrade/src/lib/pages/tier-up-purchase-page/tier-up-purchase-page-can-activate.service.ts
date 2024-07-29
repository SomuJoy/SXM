import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadTierUpPurchaseDataWorkflowService, LoadTierUpPurchaseDataWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-upgrade';

@Injectable()
export class TierUpPurchasePageCanActivateService implements CanActivate {
    private _featureRoutePath = 'tier-up/targeted';
    constructor(private readonly _loadTierUpPurchaseDataWorkflowService: LoadTierUpPurchaseDataWorkflowService, private readonly _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.substr(0, routerStateSnapshot.url.indexOf('tier-up/targeted') + 'tier-up/targeted'.length);
        return this._loadTierUpPurchaseDataWorkflowService.build().pipe(
            catchError((error: LoadTierUpPurchaseDataWorkflowServiceErrors) => {
                if (error === 'MISSING_PROGRAM_CODE' || error === 'DATA_NOT_FOUND' || error === 'TOKEN_NOT_ELIGIBLE') {
                    this._router.navigate([`${baseUrl}/default-error`], { replaceUrl: true });
                } else if (error === 'OFFER_EXPIRED') {
                    this._router.navigate([`${baseUrl}/expired-error`], { replaceUrl: true });
                } else if (error === 'OFFER_ALREADY_REDEEMED') {
                    this._router.navigate([`${baseUrl}/redeemed-error`], { replaceUrl: true });
                } else {
                    this._router.navigate([`${baseUrl}/default-error`], { replaceUrl: true });
                }
                return of(false);
            })
        );
    }
}
