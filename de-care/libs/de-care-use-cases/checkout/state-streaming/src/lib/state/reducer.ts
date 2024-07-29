import { createReducer, Action, on } from '@ngrx/store';
import {
    clearTransactionData,
    setPromoCode,
    setProspectTokenData,
    setSuccessfulTransactionData,
    setUserPickedAPlanCode,
    setfailedEligibilityCheckToTrue,
    setfailedEligibilityCheckToFalse,
    clearCheckoutStreamingTransactionState,
    setCanDisplayEarlyTerminationFeeCopies,
    setPaymentFormType,
} from './actions';
import { allowAmexTransactions, skipUpdateOfferOnProvinceChange, updateOfferOnProvinceChange } from './public.actions';

export const featureKey = 'checkoutStreaming';

export interface CheckoutStreamingState {
    userPickedAPlanCode: boolean;
    prospectTokenData: {
        userName: string;
        firstName?: string;
        lastName?: string;
        streetAddress?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        phone?: string;
    };
    transactionData?: {
        subscriptionId: number | string;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
    promoCode: string;
    failedEligibilityCheck: boolean;
    allowAmexTransactions: boolean;
    updateOfferOnProvinceChange: boolean;
    canDisplayEarlyTerminationFeeCopies: boolean;
    paymentFormType: string;
}

const initialState: CheckoutStreamingState = {
    prospectTokenData: null,
    allowAmexTransactions: false,
    userPickedAPlanCode: false,
    promoCode: null,
    failedEligibilityCheck: false,
    updateOfferOnProvinceChange: true,
    canDisplayEarlyTerminationFeeCopies: false,
    paymentFormType: 'BASIC',
};

const stateReducer = createReducer(
    initialState,
    on(setUserPickedAPlanCode, (state) => ({ ...state, userPickedAPlanCode: true })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined })),
    on(setProspectTokenData, (state, { prospectTokenData }) => ({ ...state, prospectTokenData })),
    on(setPromoCode, (state, { promoCode }) => ({ ...state, promoCode })),
    on(allowAmexTransactions, (state) => ({ ...state, allowAmexTransactions: true })),
    on(clearCheckoutStreamingTransactionState, () => initialState),
    on(setfailedEligibilityCheckToTrue, (state) => ({ ...state, failedEligibilityCheck: true })),
    on(setfailedEligibilityCheckToFalse, (state) => ({ ...state, failedEligibilityCheck: false })),
    on(setCanDisplayEarlyTerminationFeeCopies, (state, { allowed }) => ({ ...state, canDisplayEarlyTerminationFeeCopies: allowed })),
    on(skipUpdateOfferOnProvinceChange, (state) => ({ ...state, updateOfferOnProvinceChange: false })),
    on(updateOfferOnProvinceChange, (state) => ({ ...state, updateOfferOnProvinceChange: true })),
    on(setPaymentFormType, (state, { paymentFormType }) => ({ ...state, paymentFormType }))
);

export function reducer(state: CheckoutStreamingState, action: Action) {
    return stateReducer(state, action);
}
