import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { getIsUpdatePaymentMethodOnly, LoadSubmitPaymentWorkflowService } from '@de-care/de-care-use-cases/account/state-payment';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class SubmitPaymentCanActivateService implements CanActivate {
    constructor(private readonly _loadSubmitPaymentWorkflowService: LoadSubmitPaymentWorkflowService, private readonly _router: Router, private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadSubmitPaymentWorkflowService.build().pipe(
            concatMap((workFlowResult) => combineLatest([this._store.select(getIsUpdatePaymentMethodOnly), of(workFlowResult)])),
            map(([isOnlyUpdatingPayment, workFlowResult]) => {
                // If there is no payment due then we are going to a different flow
                const flowName = isOnlyUpdatingPayment ? 'updatepaymethod' : 'payment';
                this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName }));
                return workFlowResult;
            }),
            catchError(() => {
                return of(this._router.createUrlTree(['error']));
            })
        );
    }
}
