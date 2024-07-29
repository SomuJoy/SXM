import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { setToUseCardOnFile, setToNotUseCardOnFile, setPlanCode, setTransactionId, newTransactionIdDueToFailureToCompleteProcess } from '../actions';
import { map, withLatestFrom, flatMap } from 'rxjs/operators';
import { behaviorEventReactionForPaymentMethod, behaviorEventReactionForSelectedPlan, behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { Store, select } from '@ngrx/store';
import { getSelectedPlanCodeAndPrice } from '../selectors/public.selectors';
import * as uuid from 'uuid/v4';

@Injectable()
export class AcceptOfferEffects {
    constructor(private actions$: Actions, private _store: Store) {}
    selectOffer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setPlanCode),
            withLatestFrom(this._store.pipe(select(getSelectedPlanCodeAndPrice))),
            map(([_, planCodeAndPrice]) => behaviorEventReactionForSelectedPlan({ audioSelected: planCodeAndPrice }))
        )
    );

    setToUseCardOnFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setToUseCardOnFile),
            map(() => behaviorEventReactionForPaymentMethod({ paymentMethod: 'Card on File' }))
        )
    );

    setToNotUseCardOnFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setToNotUseCardOnFile),
            map(() => behaviorEventReactionForPaymentMethod({ paymentMethod: 'New Card' }))
        )
    );

    newTransactionIdDueToFailureToCompleteProcess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(newTransactionIdDueToFailureToCompleteProcess),
            flatMap(() => {
                const transactionId = `OAC-${uuid()}`;
                return [setTransactionId({ transactionId }), behaviorEventReactionForTransactionId({ transactionId })];
            })
        )
    );
}
