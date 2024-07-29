import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';
import { initialPaymentInfoState, PaymentInfo } from '../states/payment-info.state';

const reducer = createReducer(
    initialPaymentInfoState,
    on(PurchaseActions.resetPurchaseStatePaymentInfoToInitial, () => ({ ...initialPaymentInfoState })),
    on(PurchaseActions.CreditCardSelect, (state, action) => {
        return {
            ...state,
            useSavedCard: action.payload,
        };
    }),
    on(PurchaseActions.CollectForm, (state, action) => {
        return {
            ...state,
            name: action.payload.name ? action.payload.name : state.name,
            cardNumber: action.payload.cardNumber ? action.payload.cardNumber : state.cardNumber,
            expireMonth: action.payload.expireMonth ? action.payload.expireMonth : state.expireMonth,
            expireYear: action.payload.expireYear ? action.payload.expireYear : state.expireYear,
            CVV: action.payload.CVV ? action.payload.CVV : state.CVV,
            email: action.payload.email ? action.payload.email : state.email,
            billingAddress: action.payload.billingAddress ? { ...action.payload.billingAddress } : state.billingAddress,
            serviceAddress: action.payload.serviceAddress ? { ...action.payload.serviceAddress } : state.serviceAddress,
            flep: action.payload.flep ? { ...action.payload.flep } : state.flep,
            password: action.payload.password ? action.payload.password : state.password,
        };
    }),
    on(PurchaseActions.AddCCTransactionId, (state, action) => {
        return {
            ...state,
            transactionId: action.payload.transactionId,
        };
    }),

    on(PurchaseActions.ClearForm, (state, action) => {
        return {
            ...state,
            name: null,
            cardNumber: null,
            expireMonth: null,
            expireYear: null,
            CVV: null,
            billingAddress: {
                addressLine1: null,
                city: null,
                state: null,
                zip: null,
                filled: null,
                avsvalidated: null,
            },
            serviceAddress: {
                addressLine1: null,
                city: null,
                state: null,
                zip: null,
                filled: null,
                avsvalidated: null,
            },
            password: null,
        };
    }),

    on(PurchaseActions.ClearFormButKeepCredentials, (state, action) => {
        return {
            ...state,
            name: null,
            cardNumber: null,
            expireMonth: null,
            expireYear: null,
            CVV: null,
            billingAddress: {
                addressLine1: null,
                city: null,
                state: null,
                zip: null,
                filled: null,
                avsvalidated: null,
            },
            serviceAddress: {
                addressLine1: null,
                city: null,
                state: null,
                zip: null,
                filled: null,
                avsvalidated: null,
            },
        };
    }),
    on(PurchaseActions.CCError, (state, action) => {
        return {
            ...state,
            ccError: action.payload,
        };
    }),
    on(PurchaseActions.PasswordInvalidError, (state, action) => {
        return {
            ...state,
            passwordInvalidError: action.payload,
        };
    }),
    on(PurchaseActions.PasswordContainsPiiDataError, (state, action) => {
        return {
            ...state,
            passwordContainsPiiDataError: action.payload,
        };
    }),
    on(PurchaseActions.ResetTransactionId, (state, action) => {
        return {
            ...state,
            resetTransactionId: action.payload,
        };
    })
);

export function paymentInfoReducer(state: PaymentInfo, action: Action) {
    return reducer(state, action);
}
