import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getAccountProvinceCode, LoadPurchaseDataFromTokenForAddPlanWorkflowService } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError, take, tap } from 'rxjs/operators';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { PROVINCE_SELECTION, ProvinceSelection } from '@de-care/de-care/shared/ui-province-selection';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class PurchaseTargetedAddPlanCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadPurchaseDataFromTokenForAddPlanWorkflowService: LoadPurchaseDataFromTokenForAddPlanWorkflowService,
        private readonly _router: Router,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutstreamingtargeted' }));
        return this._loadPurchaseDataFromTokenForAddPlanWorkflowService.build().pipe(
            tap(() => {
                if (this._countrySettings.countryCode === 'ca') {
                    this._store
                        .select(getAccountProvinceCode)
                        .pipe(take(1))
                        .subscribe((province: string) => {
                            this._provinceSelection.setSelectedProvince(province);
                        });
                }
            }),
            catchError((error) => {
                switch (error) {
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
