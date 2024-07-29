import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadFullPricePurchaseDataWorkflowService, LoadFullPricePurchaseDataWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-upgrade';

@Injectable({ providedIn: 'root' })
export class FullPricePurchasePageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadFullPricePurchaseDataWorkflowService: LoadFullPricePurchaseDataWorkflowService) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.substr(0, routerStateSnapshot.url.indexOf('fp/targeted') + 'fp/targeted'.length);
        return this._loadFullPricePurchaseDataWorkflowService.build().pipe(
            catchError((error: LoadFullPricePurchaseDataWorkflowServiceErrors) => {
                if (error === 'MISSING_PROGRAM_CODE') {
                    this._router.navigate([`${baseUrl}/default-error`], { replaceUrl: true });
                } else if (error === 'ALREADY_UPGRADED') {
                    this._router.navigate([`${baseUrl}/already-upgraded-error`], { replaceUrl: true });
                } else {
                    this._router.navigate(['/error']);
                }
                return of(false);
            })
        );
    }
}
