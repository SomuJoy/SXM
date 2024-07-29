import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadPurchaseDataWorkflowErrors, LoadPurchaseDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PurchaseOrganicCanActivateService implements CanActivate {
    constructor(private readonly _loadPurchaseDataWorkflowService: LoadPurchaseDataWorkflowService, private readonly _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._loadPurchaseDataWorkflowService.build().pipe(
            catchError((error: LoadPurchaseDataWorkflowErrors) => {
                switch (error) {
                    case 'LEGACY_FLOW_REQUIRED':
                        return of(this._router.createUrlTree(['subscribe/checkout/streaming'], { queryParams: activatedRouteSnapshot.queryParams }));
                    case 'GENERIC_ERROR':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/streaming/generic-error', { replaceUrl: true });
                        return of(false);
                    case 'EXPIRED_OFFER':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/streaming/expired-offer-error', { replaceUrl: true });
                        return of(false);
                    case 'PROMO_CODE_REDEEMED':
                        this._router.navigateByUrl('/subscribe/checkout/purchase/streaming/promo-code-redeemed-error', { replaceUrl: true });
                        return of(false);
                    case 'SYSTEM':
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
