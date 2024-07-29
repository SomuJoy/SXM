import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoadOrganicDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class OrganicPageCanActivateService implements CanActivate {
    constructor(private readonly _loadOrganicDataWorkflowService: LoadOrganicDataWorkflowService, private readonly _store: Store, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadOrganicDataWorkflowService.build().pipe(
            map(() => {
                this._store.dispatch(pageDataFinishedLoading());
                return true;
            }),
            catchError(error => {
                this._store.dispatch(pageDataFinishedLoading());
                return of(this._router.createUrlTree(['/subscribe/upgrade-vip/error']));
            })
        );
    }
}
