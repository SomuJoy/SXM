import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getOACLoginRedirectUrl, getHasStateDataForPortConfirmation, PortConfirmationPageDataWorkflow } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { map, withLatestFrom } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PortConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store, private readonly _portConfirmationPageDataWorkflow: PortConfirmationPageDataWorkflow) {}
    canActivate(): Observable<boolean | UrlTree> {
        return this._portConfirmationPageDataWorkflow.build().pipe(
            withLatestFrom(this._store.select(getHasStateDataForPortConfirmation), this._store.select(getOACLoginRedirectUrl)),
            map(([, hasStateData, oacUrl]) => (hasStateData ? true : this._router.createUrlTree([oacUrl])))
        );
    }
}
