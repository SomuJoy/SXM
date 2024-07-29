import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';
import { initialPaymentFormState, Paymentform } from '../states/payment-form.state';

const reducer = createReducer(
    initialPaymentFormState,
    on(PurchaseActions.resetPurchaseStateFormStatusToInitial, () => ({ ...initialPaymentFormState })),
    on(PurchaseActions.SetUpsellCode, (state, action) => {
        return {
            ...state,
            upsellCode: action.payload
        };
    }),

    on(PurchaseActions.ChangeStep, (state, action) => {
        return {
            ...state,
            formStep: action.payload
        };
    }),
    on(PurchaseActions.SetStepNumberForErrorRedirects, (state, action) => {
        return {
            ...state,
            formStepNumberForErrorRedirects: action.payload
        };
    }),
    on(PurchaseActions.EnableDisableContinue, (state, action) => {
        return {
            ...state,
            btnStatus: action.payload
        };
    }),
    on(PurchaseActions.SetFlepzForm, (state, action) => {
        return {
            ...state,
            isFlepz: action.payload
        };
    }),
    on(PurchaseActions.ChangeSubscription, PurchaseActions.AddSubscription, (state, action) => {
        return {
            ...state,
            loading: true
        };
    }),
    on(PurchaseActions.CCError, PurchaseActions.PopulateQuote, PurchaseActions.ServiceError, PurchaseActions.AgreementAccepted, (state, action) => {
        return {
            ...state,
            loading: false
        };
    })
);

export function paymentFormReducer(state: Paymentform, action: Action) {
    return reducer(state, action);
}
