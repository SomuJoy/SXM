import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadSwapLookupDataWorkflowService } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { take, concatMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SwapLookupPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store, private readonly _loadSwapLookupDataWorkflowService: LoadSwapLookupDataWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            concatMap(({ subscriptionid: subscriptionId }) => this._loadSwapLookupDataWorkflowService.build({ subscriptionId })),
            catchError(() => {
                // TODO: handle any error routing needed here
                return of(this._router.createUrlTree(['./error']));
            })
        );
    }
}
