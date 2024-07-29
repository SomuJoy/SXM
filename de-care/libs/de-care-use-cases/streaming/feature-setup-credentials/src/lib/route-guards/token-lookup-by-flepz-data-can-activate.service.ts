import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
    FindAccountByTokenizedUrlDataWorkflowService,
    processInboundQueryParams,
    setIsAgentLinkScenario,
    setIsTokenizationFlow,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, concatMap, map, tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TokenLookupByFlepzDataCanActivateService implements CanActivate {
    constructor(
        private readonly _findAccountByTokenizedUrlDataWorkflowService: FindAccountByTokenizedUrlDataWorkflowService,
        private readonly _router: Router,
        private _store: Store
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];
        let utm_campaign_status = false;
        this._store.dispatch(processInboundQueryParams());
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            tap(({ utm_campaign }) => {
                if (utm_campaign === 'agent_text') {
                    utm_campaign_status = true;
                    this._store.dispatch(setIsAgentLinkScenario({ isAgentLinkScenario: true }));
                }
            }),
            concatMap(({ dtok, atok, radioid, act }) => {
                let token: string;
                let tokenType: string;
                if (dtok) {
                    token = dtok;
                } else if (atok) {
                    token = atok;
                    tokenType = 'ACCOUNT';
                }
                return this._findAccountByTokenizedUrlDataWorkflowService.build({ token, tokenType, radioid, act }).pipe(
                    map(({ ineligibleReason }) => {
                        this._store.dispatch(setIsTokenizationFlow({ isTokenizationFlow: true }));
                        // TODO: add remaining reason handling
                        switch (ineligibleReason) {
                            case 'SingleMatchOAC': {
                                if (utm_campaign_status) {
                                    return this._router.createUrlTree([`${baseUrl}credential-setup`], { queryParams: activatedRouteSnapshot.queryParams });
                                }
                                return this._router.createUrlTree([`${baseUrl}existing-credentials`], { queryParams: activatedRouteSnapshot.queryParams });
                            }
                            case 'NeedsCredentials': {
                                return this._router.createUrlTree([`${baseUrl}credential-setup`], { queryParams: activatedRouteSnapshot.queryParams });
                            }
                            case 'NonPay': {
                                return this._router.createUrlTree([`${baseUrl}ineligible-non-pay`], { queryParams: activatedRouteSnapshot.queryParams });
                            }
                            default: {
                                // if all else fails, redirect to find account page
                                return this._router.createUrlTree([baseUrl]);
                            }
                        }
                    })
                );
            }),
            catchError(() => {
                // if all else fails, redirect to find account page
                return of(this._router.createUrlTree([baseUrl]));
            })
        );
    }
}
