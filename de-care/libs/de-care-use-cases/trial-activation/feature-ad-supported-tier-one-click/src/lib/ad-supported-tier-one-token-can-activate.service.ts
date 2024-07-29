import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TrialLegacyAdSupportedWorkflowService } from '@de-care/de-care-use-cases/trial-activation/state-ad-supported-tier-one-click';
import { select, Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AdSupportedTierOneTokenCanActivateService implements CanActivate {
    constructor(
        private readonly _trialLegacyAdSupportedWorkflowService: TrialLegacyAdSupportedWorkflowService,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    canActivate() {
        return this._store.pipe(
            select(getNormalizedQueryParams),
            take(1),
            switchMap(({ tkn, token }) => this._trialLegacyAdSupportedWorkflowService.build({ token: token || tkn })),
            map(() => this._router.createUrlTree(['/activate/trial/ast/ast-activated'])),
            catchError((error) => {
                if (error?.error?.error?.errorCode === 'INELIGIBLE_OFFER') {
                    this._router.navigate(['/subscribe/checkout/flepz'], { queryParams: { programcode: 'LEGACYADOFFER' }, replaceUrl: true });
                } else if (error?.error?.error?.errorCode === 'INELIGIBLE_FOR_TRIAL') {
                    this._router.navigate(['/activate/trial/ast/not-eligible-error']);
                } else if (error?.error?.error?.errorCode === 'SELFPAY_INELIGIBLE_FOR_TRIAL') {
                    this._router.navigate(['/activate/trial/ast/already-active-selfpay-error']);
                } else if (error?.error?.error?.errorCode === 'INCOMPLETE_TRANSACTION') {
                    this._router.navigate(['/activate/trial/ast/cant-be-completed-online-error']);
                } else {
                    this._router.navigate(['/error']);
                }
                return of(false);
            })
        );
    }
}
