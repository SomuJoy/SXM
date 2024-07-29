import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';

const reducer = createReducer(
    false,
    on(PurchaseActions.resetPurchaseStateServiceErrorToInitial, () => false),
    on(PurchaseActions.ServiceError, () => {
        return true;
    }),
    on(PurchaseActions.ChangeStep, (state, action) => {
        return state && action.payload > 1 ? false : state;
    }),
    on(PurchaseActions.LoadQuote, PurchaseActions.ChangeSubscription, () => {
        return false;
    })
);

export function serviceErrorReducer(state: boolean, action: Action) {
    return reducer(state, action);
}
