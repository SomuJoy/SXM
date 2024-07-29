import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    getAccountProvinceCode,
    LoadPurchaseDataFromTokenWorkflowErrors,
    LoadPurchaseDataFromTokenWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError, take, tap } from 'rxjs/operators';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { PROVINCE_SELECTION, ProvinceSelection } from '@de-care/de-care/shared/ui-province-selection';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { parseUrl } from './redirect-helpers';

@Injectable({ providedIn: 'root' })
export class PurchaseTargeteCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadPurchaseDataFromTokenWorkflowService: LoadPurchaseDataFromTokenWorkflowService,
        private readonly _router: Router,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutstreamingtargeted' }));
        return this._loadPurchaseDataFromTokenWorkflowService.build().pipe(
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
            catchError((error: LoadPurchaseDataFromTokenWorkflowErrors) => {
                switch (error) {
                    case 'NOT_ELIGIBLE': {
                        const newUrl = parseUrl(state.url, '../generic-error');
                        return of(this._router.createUrlTree([newUrl]));
                    }
                    case 'NEW_CUSTOMER': {
                        const newUrl = parseUrl(state.url, '../organic');
                        return of(
                            this._router.createUrlTree([newUrl], {
                                queryParams: {
                                    ...activatedRouteSnapshot.queryParams,
                                    token: undefined,
                                    tkn: undefined,
                                    radioId: undefined,
                                    act: undefined,
                                    lastName: undefined,
                                },
                            })
                        );
                    }
                    case 'ADD_PLAN_CREDENTIALS_REQUIRED': {
                        const newUrl = parseUrl(state.url, '/add-plan');
                        return of(
                            this._router.createUrlTree([newUrl], {
                                queryParams: { ...activatedRouteSnapshot.queryParams, radioId: undefined, act: undefined, lastName: undefined },
                            })
                        );
                    }
                    case 'ADD_PLAN_CREDENTIALS_NON_REQUIRED': {
                        const newUrl = parseUrl(state.url, '/add-plan/non-credentials-required');
                        return of(
                            this._router.createUrlTree([newUrl], {
                                queryParams: { ...activatedRouteSnapshot.queryParams, radioId: undefined, act: undefined, lastName: undefined },
                            })
                        );
                    }
                    case 'ALREADY_HAVE_A_SUBSCRIPTION': {
                        const newUrl = parseUrl(state.url, '../you-already-have-a-subscription-error');
                        return of(this._router.createUrlTree([newUrl]));
                    }
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
