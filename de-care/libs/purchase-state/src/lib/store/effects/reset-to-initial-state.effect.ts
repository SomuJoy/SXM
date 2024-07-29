import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import {
    resetPurchaseStateDataToInitial,
    resetPurchaseStateFormStatusToInitial,
    resetPurchaseStatePackageUpgradesToInitial,
    resetPurchaseStatePaymentInfoToInitial,
    resetPurchaseStatePrepaidCardToInitial,
    resetPurchaseStateReviewOrderToInitial,
    resetPurchaseStateServiceErrorToInitial,
    resetPurchaseStateToInitial
} from '../actions/purchase.actions';

@Injectable()
export class ResetToInitialStateEffect {
    constructor(private readonly _actions$: Actions) {}

    resetPurchaseStateToInitial$ = createEffect(() =>
        this._actions$.pipe(
            ofType(resetPurchaseStateToInitial),
            flatMap(() => [
                resetPurchaseStatePaymentInfoToInitial(),
                resetPurchaseStatePrepaidCardToInitial(),
                resetPurchaseStatePackageUpgradesToInitial(),
                resetPurchaseStateReviewOrderToInitial(),
                resetPurchaseStateFormStatusToInitial(),
                resetPurchaseStateDataToInitial(),
                resetPurchaseStateServiceErrorToInitial()
            ])
        )
    );
}
