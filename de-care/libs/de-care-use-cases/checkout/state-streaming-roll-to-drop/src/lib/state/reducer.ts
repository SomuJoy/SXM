import { Action, createReducer, on } from '@ngrx/store';
import { skipUpdateOfferOnProvinceChange, updateOfferOnProvinceChange } from './public.actions';
import {
    clearCheckoutStreamingTransactionState,
    clearTransactionData,
    setfailedEligibilityCheckToFalse,
    setfailedEligibilityCheckToTrue,
    setSuccessfulTransactionData,
    loadCountryCode,
    usefullAddressForm,
} from './actions';

export const featureKey = 'checkoutStreamingRollToDrop';

export interface CheckoutStreamingRollToDropState {
    transactionData?: {
        subscriptionId: number | string;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
    isFullAddressForm: boolean;
    countryCode: string;
    updateOfferOnProvinceChange: boolean;
}

const initialState: CheckoutStreamingRollToDropState = { isFullAddressForm: false, countryCode: '', updateOfferOnProvinceChange: true };

const stateReducer = createReducer(
    initialState,
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined })),
    on(clearCheckoutStreamingTransactionState, () => initialState),
    on(setfailedEligibilityCheckToTrue, (state) => ({ ...state, failedEligibilityCheck: true })),
    on(setfailedEligibilityCheckToFalse, (state) => ({ ...state, failedEligibilityCheck: false })),
    on(usefullAddressForm, (state) => ({ ...state, isFullAddressForm: true })),
    on(loadCountryCode, (state, action) => ({ ...state, countryCode: action.countryCode })),
    on(skipUpdateOfferOnProvinceChange, (state) => ({ ...state, updateOfferOnProvinceChange: false })),
    on(updateOfferOnProvinceChange, (state) => ({ ...state, updateOfferOnProvinceChange: true }))
);

export function reducer(state: CheckoutStreamingRollToDropState, action: Action) {
    return stateReducer(state, action);
}
