import { Action, createReducer, on } from '@ngrx/store';
import {
    clearSecondDevice,
    setLoadedPurchaseData,
    setPaymentMethodToNewCard,
    setPaymentMethodToUseCardOnFile,
    setSecondDevice,
    setSecondDevices,
    clearPaymentInfo,
    setCompleteOrderStatusAsProcessing,
    setCompleteOrderStatusAsNotProcessing,
    setFirstDeviceRequestStatusAsSuccess,
    setFirstDeviceRequestStatusAsError,
    setSecondDeviceRequestStatusAsSuccess,
    setSecondDeviceRequestStatusAsError,
    setFirstDeviceCredentialsStatus,
    setSecondDeviceCredentialsStatus,
    setFirstDeviceExistingMaskedUsername,
    setSecondDeviceExistingMaskedUsername,
    setFirstDeviceExistingEmailOrUsername,
    setDisplayNuCaptcha,
    setCaptchaValidationProcessing,
    setCaptchaValidationNonProcessing,
    setProgramCode,
    setSelectedPlanCode,
    setSelectedStreamingPlanCode,
    setFirstDevice,
    setQueryParamsForCheckoutRedirect,
    setSubscriptionIdPrimaryRadio,
    setSubscriptionIdSecondaryRadio,
    setPlatinumPackageSubscriptionId,
    setStreamingAccounts,
    setIsStreaming,
    setStreamingAccount,
} from './actions';
import { PaymentInfo, Device, DeviceCredentialsStatus, Streaming } from './models';
import { setErrorCode } from './public.actions';

export const featureKey = 'upgradeVip';

export interface UpgradeVipState {
    programCode: string;
    token: string;
    selectedPlanCode: string;
    selectedStreamingPlanCode: string;
    firstDevice: Device;
    secondDevice?: Device;
    selectedPaymentMethod: 'cardOnFile' | 'newCard' | null;
    newCard: PaymentInfo;
    secondDevices: Device[];
    streamingAccounts: Streaming[];
    selectedStreamingAccount: Streaming;
    isStreaming: boolean;
    loadReviewOrderDataIsProcessing: boolean;
    completeOrderStatusIsProcesssing: boolean;
    errorCode: string;
    firstDeviceStatus: 'success' | 'error' | null;
    secondDeviceStatus: 'success' | 'error' | null;
    firstDeviceCredentialsStatus: DeviceCredentialsStatus;
    secondDeviceCredentialsStatus: DeviceCredentialsStatus;
    firstDeviceExistingMaskedUsername: string;
    secondDeviceExistingMaskedUsername: string;
    firstDeviceExistingEmailOrUsername: string;
    displayNucaptcha: boolean;
    captchaValidationProcessing: boolean;
    userEnteredAccountNumber: string;
    userEnteredRadioid: string;
    subscriptionIdPrimaryRadio: string;
    subscriptionIdSecondaryRadio: string;
    platinumPackageSubscriptionId: string;
}

const initialState: UpgradeVipState = {
    programCode: null,
    token: null,
    selectedPlanCode: null,
    selectedStreamingPlanCode: null,
    firstDevice: null,
    secondDevice: null,
    selectedPaymentMethod: null,
    newCard: null,
    secondDevices: [],
    streamingAccounts: [],
    selectedStreamingAccount: null,
    isStreaming: null,
    loadReviewOrderDataIsProcessing: false,
    completeOrderStatusIsProcesssing: false,
    errorCode: null,
    firstDeviceStatus: null,
    secondDeviceStatus: null,
    firstDeviceCredentialsStatus: null,
    secondDeviceCredentialsStatus: null,
    firstDeviceExistingMaskedUsername: null,
    secondDeviceExistingMaskedUsername: null,
    firstDeviceExistingEmailOrUsername: null,
    displayNucaptcha: false,
    captchaValidationProcessing: false,
    userEnteredAccountNumber: '',
    userEnteredRadioid: '',
    subscriptionIdPrimaryRadio: null,
    subscriptionIdSecondaryRadio: null,
    platinumPackageSubscriptionId: null,
};

const featureReducer = createReducer(
    initialState,
    on(setLoadedPurchaseData, (state, { token }) => ({
        ...state,
        token,
    })),
    on(setFirstDevice, (state, { device }) => ({
        ...state,
        firstDevice: { ...device },
    })),
    on(setProgramCode, (state, { programCode }) => ({
        ...state,
        programCode,
    })),
    on(setSelectedPlanCode, (state, { planCode: selectedPlanCode }) => ({
        ...state,
        selectedPlanCode,
    })),
    on(setSelectedStreamingPlanCode, (state, { streamingPlanCode: selectedStreamingPlanCode }) => ({
        ...state,
        selectedStreamingPlanCode,
    })),
    on(setSecondDevice, (state, { device }) => ({ ...state, secondDevice: device ? { ...device } : null })),
    on(clearSecondDevice, (state) => ({ ...state, secondRadioId: null })),
    on(setPaymentMethodToUseCardOnFile, (state, { paymentInfo }) => ({
        ...state,
        selectedPaymentMethod: 'cardOnFile',
        newCard: { ...paymentInfo },
    })),
    on(setPaymentMethodToNewCard, (state, { paymentInfo }) => ({
        ...state,
        selectedPaymentMethod: 'newCard',
        newCard: { ...paymentInfo },
    })),
    on(clearPaymentInfo, (state) => ({
        ...state,
        newCard: null,
    })),
    on(setSecondDevices, (state, { secondDevices }) => ({
        ...state,
        secondDevices: secondDevices,
    })),
    on(setStreamingAccounts, (state, { streamingAccounts }) => ({
        ...state,
        streamingAccounts: streamingAccounts,
    })),
    on(setStreamingAccount, (state, { streamingAccount }) => ({
        ...state,
        selectedStreamingAccount: streamingAccount,
    })),
    on(setIsStreaming, (state, { isStreaming }) => ({
        ...state,
        isStreaming,
    })),
    //Loading State
    on(setCompleteOrderStatusAsProcessing, (state) => ({ ...state, completeOrderStatusIsProcesssing: true })),
    on(setCompleteOrderStatusAsNotProcessing, (state) => ({ ...state, completeOrderStatusIsProcesssing: false })),

    //Device's Request state
    on(setFirstDeviceRequestStatusAsSuccess, (state) => ({ ...state, firstDeviceStatus: 'success' })),
    on(setFirstDeviceRequestStatusAsError, (state) => ({ ...state, firstDeviceStatus: 'error' })),
    on(setFirstDeviceCredentialsStatus, (state, { deviceCredentialsStatus }) => ({ ...state, firstDeviceCredentialsStatus: deviceCredentialsStatus })),
    on(setFirstDeviceExistingMaskedUsername, (state, { firstDeviceExistingMaskedUsername }) => ({ ...state, firstDeviceExistingMaskedUsername })),
    on(setFirstDeviceExistingEmailOrUsername, (state, { firstDeviceExistingEmailOrUsername }) => ({ ...state, firstDeviceExistingEmailOrUsername })),

    on(setSecondDeviceRequestStatusAsSuccess, (state) => ({ ...state, secondDeviceStatus: 'success' })),
    on(setSecondDeviceRequestStatusAsError, (state) => ({ ...state, secondDeviceStatus: 'error' })),
    on(setSecondDeviceCredentialsStatus, (state, { deviceCredentialsStatus }) => ({ ...state, secondDeviceCredentialsStatus: deviceCredentialsStatus })),
    on(setSecondDeviceExistingMaskedUsername, (state, { secondDeviceExistingMaskedUsername }) => ({ ...state, secondDeviceExistingMaskedUsername })),
    on(setDisplayNuCaptcha, (state) => ({ ...state, displayNucaptcha: true })),
    on(setCaptchaValidationProcessing, (state) => ({ ...state, captchaValidationProcessing: true })),
    on(setCaptchaValidationNonProcessing, (state) => ({ ...state, captchaValidationProcessing: false })),
    // Error state
    on(setErrorCode, (state, { errorCode }) => ({ ...state, errorCode })),
    on(setQueryParamsForCheckoutRedirect, (state, { userEnteredAccountNumber, userEnteredRadioid }) => ({
        ...state,
        userEnteredAccountNumber,
        userEnteredRadioid,
    })),
    on(setSubscriptionIdPrimaryRadio, (state, { subscriptionId }) => ({ ...state, subscriptionIdPrimaryRadio: subscriptionId })),
    on(setSubscriptionIdSecondaryRadio, (state, { subscriptionId }) => ({ ...state, subscriptionIdSecondaryRadio: subscriptionId })),
    on(setPlatinumPackageSubscriptionId, (state, { subscriptionId: platinumPackageSubscriptionId }) => ({ ...state, platinumPackageSubscriptionId }))
);

export function reducer(state: UpgradeVipState, action: Action) {
    return featureReducer(state, action);
}
