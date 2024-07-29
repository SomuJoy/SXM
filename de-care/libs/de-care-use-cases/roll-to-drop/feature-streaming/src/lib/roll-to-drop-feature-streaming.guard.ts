import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take } from 'rxjs/operators';
import { RollToDropStreamingWorkflowService, RTDStreamingWorkflowStatusEnum } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RollToDropFeatureStreamingGuard implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _rollToDropStreamingWorkflow: RollToDropStreamingWorkflowService) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(getNormalizedQueryParams),
            take(1),
            concatMap(({ programcode: programCode, langpref: langPref, promocode: promoCode, datafromrflz: dataFromRFLZ }) =>
                this._rollToDropStreamingWorkflow
                    .build({ programCode, langPref: langPref, promoCode, dataFromRFLZ })
                    .pipe(map((status) => this._handleStatusResult(status, activatedRouteSnapshot)))
            )
        );
    }

    private _handleStatusResult(status: RTDStreamingWorkflowStatusEnum, activatedRouteSnapshot: ActivatedRouteSnapshot): boolean | UrlTree {
        switch (status) {
            case RTDStreamingWorkflowStatusEnum.offerAvailable:
            case RTDStreamingWorkflowStatusEnum.offerNotAvailable:
                return true;

            case RTDStreamingWorkflowStatusEnum.offerNotAvailableAfterLoadingRTD:
            case RTDStreamingWorkflowStatusEnum.promoCodeOrProgramCodeInvalid:
                return this._routeToCheckout(activatedRouteSnapshot);
        }
    }

    private _routeToCheckout(activatedRouteSnapshot: ActivatedRouteSnapshot): UrlTree {
        return this._router.createUrlTree(['/subscribe/checkout/streaming'], {
            queryParams: activatedRouteSnapshot.queryParams,
        });
    }
}
