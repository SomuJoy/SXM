import { Injectable, Inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
    setPaymentInfo,
    setPaymentInfoCountry,
    setToUseCardOnFile,
    setToNotUseCardOnFile,
    setTermType,
    newTransactionIdDueToCreditCardError,
    setTransactionId,
} from '../actions';
import { map, withLatestFrom, flatMap } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { behaviorEventReactionForPaymentMethod, behaviorEventReactionForSelectedPlan, behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { getSelectedOrCurrentPlanCodeAndPrice, getSelectedDataCapablePlanCodeAndPrice } from '../selectors/state.selectors';
import { Store, select } from '@ngrx/store';
import * as uuid from 'uuid/v4';

@Injectable()
export class PaymentInfoEffects {
    private readonly _country: string;

    addCountry$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setPaymentInfo),
            map((action) => setPaymentInfoCountry({ country: this._country }))
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

    termSelected$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setTermType),
            withLatestFrom(this._store.pipe(select(getSelectedOrCurrentPlanCodeAndPrice)), this._store.pipe(select(getSelectedDataCapablePlanCodeAndPrice))),
            map(([, audioSelected, dataSelected]) => behaviorEventReactionForSelectedPlan({ audioSelected, dataSelected }))
        )
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            flatMap(() => {
                const transactionId = `OAC-${uuid()}`;
                return [setTransactionId({ transactionId }), behaviorEventReactionForTransactionId({ transactionId })];
            })
        )
    );

    constructor(private actions$: Actions, @Inject(SettingsService) settingsService: SettingsService, private _store: Store) {
        this._country = settingsService.isCanadaMode ? 'CA' : 'US';
    }
}
