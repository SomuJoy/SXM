import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { SetProactiveRTCTrue, SetSelectedRenewalPlan } from '@de-care/checkout-state';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class CheckoutFromRtcProactiveGuard implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _urlHelperService: UrlHelperService) {}
    canActivate(route: ActivatedRouteSnapshot) {
        const programcode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');
        const act: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'act');
        const renewalCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'renewalCode');
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'RadioID');
        const selectedRenewalPackageName: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'selectedRenewalPackageName');
        this._store.dispatch(SetProactiveRTCTrue());
        this._store.dispatch(SetSelectedRenewalPlan({ payload: { packageName: selectedRenewalPackageName } }));
        return this._router.createUrlTree(['subscribe', 'checkout', { proactiveFlag: true }], {
            queryParams: {
                programcode,
                renewalCode,
                radioId,
                act,
                isIdentifiedUser: true,
            },
        });
    }
}
