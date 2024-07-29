import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { RollToDropStreamingWorkflowService, RTDStreamingWorkflowStatusEnum, LoadRTDCustomerOfferWorkflowService } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { RecoverRTDStreamingTokenDataWorkflowService, RTDStreamingTokenResponse } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming-tokenized';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class RollToDropFeatureStreamingTokenizedGuard implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _rollToDropStreamingWorkflow: RollToDropStreamingWorkflowService,
        private readonly _recoverRTDStreamingTokenDataWorkflowService: RecoverRTDStreamingTokenDataWorkflowService,
        private readonly _loadRTDCustomerOfferWorkflowService: LoadRTDCustomerOfferWorkflowService
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(getNormalizedQueryParams),
            take(1),
            concatMap(({ programcode: programCode, langpref: langPref, promocode: promoCode, datafromrflz: dataFromRFLZ, tkn: token }) => {
                return this._rollToDropStreamingWorkflow.build({ programCode, langPref, promoCode, dataFromRFLZ }).pipe(
                    map(status => this._handleStatusResult(status, activatedRouteSnapshot)),
                    concatMap(resp => {
                        if (!token) {
                            return of(this._routeToOrganicRtdStreaming(activatedRouteSnapshot));
                        }
                        if (resp === true) {
                            return this._recoverRTDStreamingTokenDataWorkflowService.build({ token }).pipe(
                                map(response => this._handleRTDStreamingTokenResponse(response, activatedRouteSnapshot)),
                                concatMap(response => this._loadRTDCustomerOfferWorkflowService.build().pipe(map(_ => response)))
                            );
                        }
                        return of(resp);
                    })
                );
            })
        );
    }

    private _handleRTDStreamingTokenResponse(response: RTDStreamingTokenResponse, activatedRouteSnapshot: ActivatedRouteSnapshot) {
        switch (response) {
            case RTDStreamingTokenResponse.HasAccount:
                return this._addNoAccountFoundFlagToRoute(activatedRouteSnapshot);

            case RTDStreamingTokenResponse.NoToken:
                return this._routeToOrganicRtdStreaming(activatedRouteSnapshot);

            default:
                return true;
        }
    }

    private _handleStatusResult(status: RTDStreamingWorkflowStatusEnum, activatedRouteSnapshot: ActivatedRouteSnapshot): boolean | UrlTree {
        switch (status) {
            case RTDStreamingWorkflowStatusEnum.offerAvailable:
            case RTDStreamingWorkflowStatusEnum.offerNotAvailable:
                return true;

            case RTDStreamingWorkflowStatusEnum.tokenInvalidOrNotAvailable:
                return this._routeToOrganicRtdStreaming(activatedRouteSnapshot);

            case RTDStreamingWorkflowStatusEnum.promoCodeOrProgramCodeInvalid:
            case RTDStreamingWorkflowStatusEnum.offerNotAvailableAfterLoadingRTD:
                return this._routeToCheckout(activatedRouteSnapshot);
        }
    }

    private _routeToCheckout(activatedRouteSnapshot: ActivatedRouteSnapshot): UrlTree {
        return this._router.createUrlTree(['/subscribe/checkout/streaming'], {
            queryParams: activatedRouteSnapshot.queryParams
        });
    }

    private _routeToOrganicRtdStreaming(activatedRouteSnapshot: ActivatedRouteSnapshot): UrlTree {
        const { ['tkn']: removedToken, ...pathWithoutToken } = activatedRouteSnapshot.queryParams;
        return this._router.createUrlTree(['/subscribe/trial/streaming'], { queryParams: pathWithoutToken });
    }

    private _addNoAccountFoundFlagToRoute(activatedRouteSnapshot: ActivatedRouteSnapshot): UrlTree {
        const { ['tkn']: removedToken, ...pathWithoutToken } = activatedRouteSnapshot.queryParams;
        const newQueryParams = { ...pathWithoutToken, hasAccount: true };
        return this._router.createUrlTree(['/subscribe/trial/streaming'], { queryParams: newQueryParams });
    }
}
