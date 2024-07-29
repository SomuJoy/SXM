import { Action, createReducer, on } from '@ngrx/store';
import {
    clearCustomerInfo,
    clearTransactionData,
    collectAllInboundQueryParams,
    setCustomerInfo,
    setDeviceInfo,
    setSelectedPlanCode,
    setSelectedProvinceCode,
    setSuccessfulTransactionData,
    setTransactionIdForSession,
} from './actions';

export const featureKey = 'zeroCost';

export interface ZeroCostState {
    inboundQueryParams?: { [key: string]: string };
    transactionIdForSession: string | null;
    selectedPlanCode: string | null;
    customerInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        serviceAddress: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            avsValidated: boolean;
        };
    };
    selectedProvinceCode?: string;
    deviceInfo?: {
        last4DigitsOfRadioId: string;
        channelId?: number;
        primaryBrandId?: number;
        promoCode?: string;
        deviceStatus?: string;
        vehicleInfo: {
            year: string | number;
            make: string;
            model: string;
        };
    };
    transactionData?: {
        email: string;
        status: string;
        radioId: string;
        subscriptionId: number;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
}
const initialState: ZeroCostState = {
    transactionIdForSession: null,
    selectedPlanCode: null,
};

const stateReducer = createReducer(
    initialState,
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams: { ...state.inboundQueryParams, ...inboundQueryParams } })),
    on(setTransactionIdForSession, (state, { transactionIdForSession }) => ({ ...state, transactionIdForSession })),
    on(setSelectedPlanCode, (state, { planCode }) => ({ ...state, selectedPlanCode: planCode })),
    on(setCustomerInfo, (state, { customerInfo }) => ({ ...state, customerInfo: { ...customerInfo } })),
    on(clearCustomerInfo, (state) => ({ ...state, customerInfo: undefined })),
    on(setSelectedProvinceCode, (state, { provinceCode }) => ({ ...state, selectedProvinceCode: provinceCode })),
    on(setDeviceInfo, (state, { deviceInfo }) => ({ ...state, deviceInfo })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined }))
);

export function reducer(state: ZeroCostState, action: Action) {
    return stateReducer(state, action);
}
