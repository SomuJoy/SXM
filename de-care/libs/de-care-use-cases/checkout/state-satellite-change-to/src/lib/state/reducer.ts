import { Action, createReducer, on } from '@ngrx/store';
import {
    clearTransactionData,
    setSelectedRadioId,
    setSelectedSubscriptionId,
    setSelectedUpsellPlanCode,
    setSubscriptionIdToChangeFrom,
    setSuccessfulTransactionData,
} from './actions';

export const featureKey = 'checkoutSatelliteChangeTo';

export interface CheckoutSatelliteChangeToState {
    selectedRadioId: string | null;
    selectedSubscriptionId: string | null;
    subscriptionIdToChangeFrom: string | null;
    selectedUpsellPlanCode: string | null;
    transactionData?: {
        email: string;
        subscriptionId: number | string;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
}
const initialState: CheckoutSatelliteChangeToState = {
    selectedRadioId: null,
    selectedSubscriptionId: null,
    subscriptionIdToChangeFrom: null,
    selectedUpsellPlanCode: null,
    transactionData: {
        email: null,
        subscriptionId: null,
        accountNumber: null,
        isUserNameSameAsEmail: false,
        isOfferStreamingEligible: false,
        isEligibleForRegistration: false,
    },
};

const stateReducer = createReducer(
    initialState,
    on(setSelectedRadioId, (state, { radioId }) => ({ ...state, selectedRadioId: radioId })),
    on(setSelectedSubscriptionId, (state, { subscriptionId }) => ({ ...state, selectedSubscriptionId: subscriptionId })),
    on(setSubscriptionIdToChangeFrom, (state, { subscriptionIdToChangeFrom }) => ({ ...state, subscriptionIdToChangeFrom })),
    on(setSelectedUpsellPlanCode, (state, { planCode }) => ({ ...state, selectedUpsellPlanCode: planCode })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined }))
);

export function reducer(state: CheckoutSatelliteChangeToState, action: Action) {
    return stateReducer(state, action);
}
