import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { allowAmexTransactions, LoadPurchaseAmexDataWorkflowErrors, LoadPurchaseAmexDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-streaming';

@Injectable({ providedIn: 'root' })
export class PurchaseOrganicAmexCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _loadPurchaseAmexDataWorkflowService: LoadPurchaseAmexDataWorkflowService,
        private readonly _router: Router
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadPurchaseAmexDataWorkflowService.build().pipe(
            tap(() => this._store.dispatch(allowAmexTransactions())),
            catchError((error: LoadPurchaseAmexDataWorkflowErrors) => {
                if (error === 'AMEX_SDK_ERROR') {
                    return of(this._router.createUrlTree(['subscribe', 'checkout', 'purchase', 'streaming', 'technical-issues']));
                } else if (error === 'AMEX_ERROR_CUSTOM_REDIRECTION') {
                    return of(false);
                }
                return of(this._router.createUrlTree(['error']));
            })
        );
    }
}
