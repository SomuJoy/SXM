import { Injectable } from '@angular/core';
import { resetCheckoutStateToInitial } from '@de-care/checkout-state';
import { resetPurchaseStateToInitial } from '@de-care/purchase-state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import { clearCheckoutStateRelatedData } from './clear-application-states.actions';

@Injectable()
export class ClearApplicationStatesEffects {
    constructor(private readonly _actions$: Actions) {}

    clearCheckoutStateRelatedData$ = createEffect(() =>
        this._actions$.pipe(
            ofType(clearCheckoutStateRelatedData),
            flatMap(() => [resetCheckoutStateToInitial(), resetPurchaseStateToInitial()])
        )
    );
}
