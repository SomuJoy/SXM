import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadChangeSubscriptionPurchaseWorkflowService, LoadChangeSubscriptionErrors } from '@de-care/de-care-use-cases/change-subscription/state-purchase';
import { catchError } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PurchaseFlowGuardService implements CanActivate {
    private readonly _window: Window;

    constructor(
        @Inject(DOCUMENT) document,
        private _router: Router,
        private _loadChangeSubscriptionPurchaseWorkflowService: LoadChangeSubscriptionPurchaseWorkflowService,
        private readonly _settingsSrv: SettingsService
    ) {
        this._window = document && document.defaultView;
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._loadChangeSubscriptionPurchaseWorkflowService.build({ changeTermOnly: !!route.data?.changeTermOnly }).pipe(
            catchError((error: LoadChangeSubscriptionErrors) => {
                if (error === 'OTHER') {
                    return this._errorRedirectStream();
                } else if (error === 'TOKEN_ERROR' || error === 'NON_ELEGIBLE_REDIRECT' || error === 'NO_SUBSCRIPTION_FOUND') {
                    this._redirectToLogin();
                    return of(false);
                } else if (error === 'UNAUTHENTICATED_CUSTOMER') {
                    return of(this._router.createUrlTree(['/account/login']));
                }
                return of(true);
            })
        );
    }

    private _errorRedirectStream(): Observable<UrlTree> {
        return of(this._router.createUrlTree(['/error']));
    }

    private _redirectToLogin() {
        // TODO: make this an observable that'll use the router store query params
        const tokenizedQueryParams = this._window.location.href.split('?');

        let allQueryParams = tokenizedQueryParams?.[1] || '';

        allQueryParams = allQueryParams.replace('upgradeaapr', 'upgrade').replace('radioid', 'esn');

        if (allQueryParams.indexOf('tkn') !== -1 && allQueryParams.indexOf('esn') === -1) {
            allQueryParams = allQueryParams + '&esn=';
        }

        this._window.location.href = `${this._settingsSrv.settings.oacUrl}login_view.action?${allQueryParams}`;
    }
}
