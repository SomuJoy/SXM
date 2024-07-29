import { Action, createReducer, on } from '@ngrx/store';
import { clearTransactionData, setDeviceInfo, setSelectedRadioId, setSelectedSubscriptionId, setSuccessfulTransactionData } from './actions';

export const featureKey = 'checkoutSatellite';

export interface CheckoutSatelliteState {
    selectedRadioId?: string;
    selectedSubscriptionId?: string;
    transactionData?: {
        email: string;
        subscriptionId: number | string;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
    deviceInfo?: {
        radioId?: string;
        last4DigitsOfRadioId?: string;
        channelId?: number;
        primaryBrandId?: string | number;
        promoCode?: string;
        deviceStatus?: string;
        vehicleInfo?: {
            year?: string | number;
            make?: string;
            model?: string;
            vin?: string;
        };
        nickname?: string;
        hasDuplicateVehicleInfo?: boolean;
    };
}
const initialState: CheckoutSatelliteState = {};

const stateReducer = createReducer(
    initialState,
    on(setSelectedRadioId, (state, { radioId }) => ({ ...state, selectedRadioId: radioId })),
    on(setSelectedSubscriptionId, (state, { subscriptionId }) => ({ ...state, selectedSubscriptionId: subscriptionId })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined })),
    on(setDeviceInfo, (state, { deviceInfo }) => ({ ...state, deviceInfo }))
);

export function reducer(state: CheckoutSatelliteState, action: Action) {
    return stateReducer(state, action);
}
