import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { SetPickAPlanOrganicTrue, SetSelectedOfferPackageName } from '@de-care/checkout-state';
import { Store } from '@ngrx/store';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@Injectable({
    providedIn: 'root',
})
export class CheckoutFromPickAPlanProactiveGuard implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _urlHelperService: UrlHelperService,
        private _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService
    ) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const programcode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');
        const promocode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'promocode');
        const act: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'act');
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'RadioID');
        const selectedPackageName: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'selectedPackageName');
        const langpref: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'langpref');
        const province: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'province');
        this._store.dispatch(SetPickAPlanOrganicTrue());
        this._store.dispatch(SetSelectedOfferPackageName({ payload: { packageName: selectedPackageName } }));
        if (this._settingsService.isCanadaMode && province) {
            this._userSettingsService.setSelectedCanadianProvince(province);
        }
        return this._router.createUrlTree(['subscribe', 'checkout', { proactiveFlow: true }], {
            queryParams: {
                programcode,
                radioId,
                act,
                promocode,
                langpref,
            },
        });
    }
}
