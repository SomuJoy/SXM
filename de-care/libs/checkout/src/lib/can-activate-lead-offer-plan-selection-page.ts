import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, mapTo, take } from 'rxjs/operators';
import { getLandingPageInboundUrlParams, LoadPickAPlanWorkflowService } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { SetCanUseDetailedGrid } from '@de-care/checkout-state';
import { SettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class CanActivateLeadOfferPlanSelectionPage implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _store: Store,
        private readonly _settingsService: SettingsService,
        private readonly _loadPickAPlanWorkflowService: LoadPickAPlanWorkflowService
    ) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        this._store.dispatch(SetCanUseDetailedGrid({ payload: { canUseDetailedGrid: !this._settingsService.isCanadaMode } }));

        return this._store.pipe(
            select(getLandingPageInboundUrlParams),
            take(1),
            concatMap(({ programCode, radioId, accountNumber }) => {
                return this._loadPickAPlanWorkflowService.build().pipe(
                    mapTo(true),
                    catchError(() => this._redirectToCheckout(accountNumber, radioId))
                );
            })
        );
    }

    private _redirectToCheckout(accountNumber: string, radioId: string): Observable<UrlTree> {
        return of(
            this._router.createUrlTree(['/subscribe/checkout'], {
                queryParams: { act: accountNumber, radioId },
            })
        );
    }
}
