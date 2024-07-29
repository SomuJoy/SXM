import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoadZeroCostCheckoutWorkflowErrors, LoadZeroCostCheckoutWorkflowService } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { parseUrl } from '../../parse-url';

@Injectable({
    providedIn: 'root',
})
export class StepDeviceLookupCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadZeroCostCheckoutWorkflowService: LoadZeroCostCheckoutWorkflowService) {}

    canActivate(_, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._loadZeroCostCheckoutWorkflowService.build().pipe(
            catchError((error: LoadZeroCostCheckoutWorkflowErrors) => {
                switch (error) {
                    case 'PROMO_CODE_EXPIRED': // should we go somewhere different for expired?
                    case 'PROMO_CODE_INVALID':
                        // TODO: where should we send the user if they came in with an invalid a promo code?
                        this._router.navigate(['./error'], { replaceUrl: true });
                        return of(false);
                    case 'NO_PROMO_CODE':
                        // TODO: where should we send the user if they came in without a promo code?
                        this._router.navigate(['./error'], { replaceUrl: true });
                        return of(false);
                    case 'PROMO_CODE_USED':
                        this._router.navigate([parseUrl(state.url, '../../promo-code-redeemed-error')], { replaceUrl: true });
                        return of(false);
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
