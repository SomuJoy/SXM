import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
    LoadFreeListenSetupDataWorkflowErrors,
    LoadFreeListenSetupDataWorkflowService,
    selectFreeListenCampaignInfo,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class FreeListenSetupCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadFreeListenSetupDataWorkflowService: LoadFreeListenSetupDataWorkflowService, private _store: Store) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean | UrlTree> {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];
        return this._loadFreeListenSetupDataWorkflowService.build().pipe(
            concatMap((data) => {
                if (data) {
                    return this._store.pipe(
                        select(selectFreeListenCampaignInfo),
                        take(1),
                        map((result) => (result.isActive ? true : this._router.createUrlTree([`${baseUrl}setup-credentials`])))
                    );
                }
            }),
            catchError((error: LoadFreeListenSetupDataWorkflowErrors) => {
                return of(this._router.createUrlTree([`${baseUrl}setup-credentials`]));
            })
        );
    }
}
