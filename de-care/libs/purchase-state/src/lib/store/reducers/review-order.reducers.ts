import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';
import { initialReviewOrderState, ReviewOrder } from '../states/review-order.state';

const reducer = createReducer(
    initialReviewOrderState,
    on(PurchaseActions.resetPurchaseStateReviewOrderToInitial, () => ({ ...initialReviewOrderState })),
    on(PurchaseActions.AgreementAccepted, (state, action) => {
        return {
            ...state,
            agreement: action.payload
        };
    })
);

export function reviewOrderReducer(state: ReviewOrder, action: Action) {
    return reducer(state, action);
}
