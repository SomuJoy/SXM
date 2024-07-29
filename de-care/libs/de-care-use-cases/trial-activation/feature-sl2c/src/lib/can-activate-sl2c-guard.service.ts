import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { PrefillServiceResponseStatus, PrefillWorkFlowService, setCorpIdFromQueryParams } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { FetchPartnerInfoWorkflowService } from '@de-care/domains/partner/state-partner-info';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, take, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanActivateSl2cGuardService implements CanActivate {
    constructor(
        private _store: Store,
        private _prefillWorkflowService: PrefillWorkFlowService,
        private _router: Router,
        private readonly _fetchPartnerInfoWorkflowService: FetchPartnerInfoWorkflowService
    ) {}

    canActivate(route: ActivatedRouteSnapshot) {
        const brandingType = route.data.brandingType;

        if (!brandingType) {
            return of(this._goToError());
        }

        return this._fetchPartnerInfoWorkflowService.build().pipe(
            withLatestFrom(this._store.pipe(select(getNormalizedQueryParams))),
            take(1),
            concatMap(([_, queryParams]) => {
                const token = queryParams.tkn;
                const corpId = queryParams.corpid;

                // Basic sanity check
                if (!/^\d+$/.test(corpId)) {
                    return of(this._goToError());
                }

                this._store.dispatch(setCorpIdFromQueryParams({ corpId }));

                // We can proceed to the page without a valid token, but if one is present we try to prefill VIN
                return this._verifyToken(token, brandingType);
            }),

            catchError(() => {
                return of(this._goToError());
            })
        );
    }

    private _verifyToken(token: string, brandingType: string) {
        return this._prefillWorkflowService.build({ token, brandingType }).pipe(
            map(status => {
                if (status === PrefillServiceResponseStatus.fail) {
                    return this._goToError();
                }

                if (status === PrefillServiceResponseStatus.existingCustomerValidated) {
                    return this._goToConfirmation();
                }

                return true;
            })
        );
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['error']);
    }

    private _goToConfirmation(): UrlTree {
        return this._router.createUrlTree(['activate', 'trial', 'confirmation']);
    }
}
