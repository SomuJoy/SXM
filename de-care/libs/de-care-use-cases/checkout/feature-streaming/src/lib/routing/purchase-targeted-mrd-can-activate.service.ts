import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    getAccountProvinceCode,
    LoadPurchaseDataForMrdFromTokenWorkflowErrors,
    LoadPurchaseDataForMrdFromTokenWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { catchError, take, tap } from 'rxjs/operators';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { PROVINCE_SELECTION, ProvinceSelection } from '@de-care/de-care/shared/ui-province-selection';
import { UserSettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class PurchaseTargetedMrdCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadPurchaseDataFromMrdFromTokenWorkflowService: LoadPurchaseDataForMrdFromTokenWorkflowService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _router: Router,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutstreamingtargetedmrd' }));
        return this._loadPurchaseDataFromMrdFromTokenWorkflowService.build().pipe(
            tap(() => {
                this._store
                    .select(getAccountProvinceCode)
                    .pipe(take(1))
                    .subscribe((province: string) => {
                        this._provinceSelection.setSelectedProvince(province);
                        /* TODO: refactor quote-summary component to take province as input and remove the
                        dependency on userSettingsService from legacy logic.
                        Line below is needed to show Quebec associated quote summary data on confirmation page.
                        */
                        this._userSettingsService.setSelectedCanadianProvince(province);
                    });
            }),
            catchError((error: LoadPurchaseDataForMrdFromTokenWorkflowErrors) => {
                switch (error) {
                    // TODO: add cases for different error scenarios that need redirects
                    default:
                        return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
