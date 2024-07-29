import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
    setPaymentMethodAsCardOnFile,
    setPaymentMethodAsNotCardOnFile,
    setPaymentTypeAsInvoice,
    setRadioIdToReplace,
    setTransactionId,
    newTransactionIdDueToCreditCardError,
} from './actions';
import { map, withLatestFrom, flatMap } from 'rxjs/operators';
import {
    behaviorEventReactionActiveSubscriptionPlanCodes,
    behaviorEventReactionForPaymentMethod,
    behaviorEventReactionForTransactionId,
} from '@de-care/shared/state-behavior-events';
import { getSelectedSelfPaySubscription } from '../state/selectors/state.selectors';
import * as uuid from 'uuid/v4';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions: Actions, private readonly _store: Store) {}

    setToUseCardOnFile$ = createEffect(() =>
        this._actions.pipe(
            ofType(setPaymentMethodAsCardOnFile),
            map(() => behaviorEventReactionForPaymentMethod({ paymentMethod: 'Card on File' }))
        )
    );

    setToNotUseCardOnFile$ = createEffect(() =>
        this._actions.pipe(
            ofType(setPaymentMethodAsNotCardOnFile),
            map(() => behaviorEventReactionForPaymentMethod({ paymentMethod: 'New Card' }))
        )
    );

    setPaymentTypeToInvoice$ = createEffect(() =>
        this._actions.pipe(
            ofType(setPaymentTypeAsInvoice),
            map(() => behaviorEventReactionForPaymentMethod({ paymentMethod: 'Invoice' }))
        )
    );

    setRadioIdToReplace$ = createEffect(() =>
        this._actions.pipe(
            ofType(setRadioIdToReplace),
            withLatestFrom(this._store.pipe(select(getSelectedSelfPaySubscription))),
            map(([, subscription]) => {
                const plans = subscription?.plans?.map((plan) => ({ code: plan.code }));
                return behaviorEventReactionActiveSubscriptionPlanCodes({ plans });
            })
        )
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this._actions.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            flatMap(() => {
                const transactionId = `OAC-${uuid()}`;
                return [setTransactionId({ transactionId }), behaviorEventReactionForTransactionId({ transactionId })];
            })
        )
    );
}
