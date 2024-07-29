import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadPurchaseDataWorkflowErrors, LoadPurchaseDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PurchaseOrganicCanActivateService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _loadPurchaseDataWorkflowService: LoadPurchaseDataWorkflowService, private readonly _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._loadPurchaseDataWorkflowService.build().pipe(
            catchError((error: LoadPurchaseDataWorkflowErrors) => {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED': {
                        return of(this._router.createUrlTree(['subscribe/checkout'], { queryParams: activatedRouteSnapshot.queryParams }));
                    }
                    case 'PROMO_CODE_EXPIRED':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/satellite/expired-offer-error', { replaceUrl: true });
                        return of(false);
                    case 'PROMO_CODE_INVALID':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/satellite/generic-error', { replaceUrl: true });
                        return of(false);
                    case 'PROMO_CODE_REDEEMED':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/satellite/promo-code-redeemed-error', { replaceUrl: true });
                        return of(false);
                    case 'SYSTEM':
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
