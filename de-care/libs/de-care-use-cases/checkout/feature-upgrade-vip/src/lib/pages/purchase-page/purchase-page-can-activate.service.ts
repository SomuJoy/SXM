import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { getErrorCode, LoadCheckoutDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';

@Injectable()
export class PurchasePageCanActivateService implements CanActivate {
    constructor(
        private readonly _loadCheckoutDataWorkflowService: LoadCheckoutDataWorkflowService,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _urlHelperService: UrlHelperService
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        const programcode: string = this._urlHelperService.getCaseInsensitiveParam(activatedRouteSnapshot.queryParamMap, 'programcode');
        return this._loadCheckoutDataWorkflowService.build().pipe(
            map(() => {
                this._store.dispatch(pageDataFinishedLoading());
                return true;
            }),
            catchError((error) => {
                this._store.dispatch(pageDataFinishedLoading());
                if (error === 'fallback') {
                    return of(
                        this._router.createUrlTree(['/subscribe/upgrade-vip/flepz'], {
                            queryParams: { tbView: 'DM', programcode: programcode },
                        })
                    );
                } else {
                    return of(this._router.createUrlTree(['/subscribe/upgrade-vip/error']));
                }
            })
        );
    }
}
