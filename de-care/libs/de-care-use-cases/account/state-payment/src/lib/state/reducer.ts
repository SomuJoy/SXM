import { state } from '@angular/animations';
import { Action, createReducer, on } from '@ngrx/store';
import { setTransactionIdForSession, setCreditCardType, setConfirmationDataReady, setUpdatePaymentProcessSuccessFul, clearUpdatePaymentProcessSuccessFul } from './actions';
import { collectPaymentInformation } from './public.actions';
import { setPaymentProcessSuccessful, clearPaymentProcessSuccessful } from '../state/actions';

export const featureKey = 'payment';

export interface PayemntInformation {
    addressLine1: string;
    avsValidated: boolean;
    cardNumber: string;
    chargeAgreementAccepted: boolean;
    city: string;
    cvv: string;
    expirationDate: string;
    nameOnCard: string;
    paymentAmountOption: number;
    paymentFrequencyOption: string;
    state: string;
    zip: string;
    country: string;
    cardType: string;
}

export interface PaymentState {
    transactionIdForSession: string | null;
    paymentInformation: PayemntInformation | null;
    paymentProcessSuccessful: boolean;
    updatePaymentProcessSuccessful: boolean;
    confirmationDataReady: boolean;
}
const initialState: PaymentState = {
    transactionIdForSession: null,
    paymentInformation: null,
    paymentProcessSuccessful: false,
    updatePaymentProcessSuccessful: false,
    confirmationDataReady: false,
};
const stateReducer = createReducer(
    initialState,
    on(setTransactionIdForSession, (state, { transactionIdForSession }) => ({ ...state, transactionIdForSession })),
    on(collectPaymentInformation, (state, { paymentInformation }) => ({ ...state, paymentInformation })),
    on(setPaymentProcessSuccessful, (state) => ({ ...state, paymentProcessSuccessful: true })),
    on(setUpdatePaymentProcessSuccessFul, (state) => ({ ...state, updatePaymentProcessSuccessful: true })),
    on(clearUpdatePaymentProcessSuccessFul, (state) => ({ ...state, updatePaymentProcessSuccessful: false })),
    on(clearPaymentProcessSuccessful, (state) => ({ ...state, paymentProcessSuccessful: false })),
    on(setCreditCardType, (state, { cardType }) => ({ ...state, paymentInformation: { ...state.paymentInformation, cardType } })),
    on(setConfirmationDataReady, (state) => ({ ...state, confirmationDataReady: true }))
);
export function reducer(state: PaymentState, action: Action) {
    return stateReducer(state, action);
}
