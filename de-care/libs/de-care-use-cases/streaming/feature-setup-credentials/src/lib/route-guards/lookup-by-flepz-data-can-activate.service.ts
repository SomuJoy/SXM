import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FindAccountByFlepzUrlDataWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LookupByFlepzDataCanActivateService implements CanActivate {
    constructor(private readonly _findAccountByFlepzUrlDataWorkflowService: FindAccountByFlepzUrlDataWorkflowService, private readonly _router: Router) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];

        return this._findAccountByFlepzUrlDataWorkflowService.build().pipe(
            map(({ totalSubscriptionsFound, ineligibleReason }) => {
                if (totalSubscriptionsFound === 0) {
                    return this._router.createUrlTree([`${baseUrl}no-match`], { queryParams: activatedRouteSnapshot.queryParams });
                } else if (totalSubscriptionsFound === 1) {
                    switch (ineligibleReason) {
                        case 'SingleMatchOAC': {
                            return this._router.createUrlTree([`${baseUrl}existing-credentials`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'NeedsCredentials': {
                            return this._router.createUrlTree([`${baseUrl}credential-setup`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'NonPay': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-non-pay`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'NonConsumer': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-non-consumer`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'TrialWithinLastTrialDate': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-trial-within-last-trial-date`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'MaxLifetimeTrials': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-max-lifetime-trials`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'InsufficientPackage': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-insufficient-package`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'ExpiredAATrial': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-expired-AA-trial`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'InActive': {
                            return this._router.createUrlTree([`${baseUrl}inactive-subscription`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                        case 'NoAudio': {
                            return this._router.createUrlTree([`${baseUrl}ineligible-no-audio`], { queryParams: activatedRouteSnapshot.queryParams });
                        }
                    }
                } else if (totalSubscriptionsFound > 1) {
                    return this._router.createUrlTree([`${baseUrl}multiple-subscriptions-page`], { queryParams: activatedRouteSnapshot.queryParams });
                } else {
                    // if all else fails, redirect to find account page
                    return this._router.createUrlTree([baseUrl], { queryParams: activatedRouteSnapshot.queryParams });
                }
            }),
            catchError(() => {
                // if all else fails, redirect to find account page
                return of(this._router.createUrlTree([baseUrl], { queryParams: activatedRouteSnapshot.queryParams }));
            })
        );
    }
}
