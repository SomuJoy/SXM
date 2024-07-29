import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { GetUpsells as CheckoutGetUpsells } from '@de-care/checkout-state';
import { GetUpsells } from '../actions/purchase.actions';

@Injectable()
export class PackageUpgradesEffects {
    // This resolves a circular dependency between checkout-state and purchase-state
    getUpsells$ = createEffect(() =>
        this._actions$.pipe(
            ofType(CheckoutGetUpsells),
            map(action => GetUpsells({ payload: action.payload }))
        )
    );

    constructor(private _actions$: Actions) {}
}
