import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadAddRadioFindSubscriptionWorkflowService } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';

@Injectable({
    providedIn: 'root',
})
export class FindSubscriptionAddRadioRouterCanActivateService implements CanActivate {
    constructor(private readonly _loadAddRadioFindSubscriptionWorkflowService: LoadAddRadioFindSubscriptionWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<UrlTree> {
        return this._loadAddRadioFindSubscriptionWorkflowService.build().pipe(
            map(() => {
                return this._router.createUrlTree(['/subscribe/checkout/purchase/satellite/add-radio-router/device-lookup']);
            }),
            catchError(() => of(this._router.createUrlTree(['/error'])))
        );
    }
}
