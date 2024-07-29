import { Action, createReducer, on } from '@ngrx/store';
import { clearTransactionData, setDeviceInfo, setSelectedRadioId, setSuccessfulTransactionData } from './actions';

export const featureKey = 'checkoutAddRadioRouter';

export interface CheckoutAddRadioRouterState {
    selectedRadioId: string | null;
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
const initialState: CheckoutAddRadioRouterState = {
    selectedRadioId: null,
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
    on(setDeviceInfo, (state, { deviceInfo }) => ({ ...state, deviceInfo })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined }))
);

export function reducer(state: CheckoutAddRadioRouterState, action: Action) {
    return stateReducer(state, action);
}
