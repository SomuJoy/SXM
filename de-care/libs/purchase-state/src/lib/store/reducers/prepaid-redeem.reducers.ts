import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';
import { initialPrepaidRedeemState, PrepaidRedeem } from '../states/prepaid-redeem.state';

const reducer = createReducer(
    initialPrepaidRedeemState,
    on(PurchaseActions.resetPurchaseStatePrepaidCardToInitial, () => ({ ...initialPrepaidRedeemState })),
    on(PurchaseActions.ReceivePrepaid, (state, action) => {
        return {
            ...state,
            balance: action.payload.amount,
            currency: action.payload.currency,
            error: action.payload.error ? true : false
        };
    }),
    on(PurchaseActions.RemovePrepaid, (state, action) => {
        return {
            ...state,
            giftCardNumber: null,
            balance: null,
            currency: null,
            error: null
        };
    })
);

export function prepaidReducer(state: PrepaidRedeem, action: Action) {
    return reducer(state, action);
}
