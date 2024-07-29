import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    collectFlepzData,
    collectSelectedRadioIdLastFour,
    collectRegistrationCredentials,
    collectRegistrationSecurityQuestionAnswers,
    collectRegistrationServiceAddressAndPhoneNumber,
    setIsAgentLinkScenario,
    setDeviceActivationIsForTrial,
    clearDeviceActivationCode,
    setInvalidEmailErrorForCredentialSetup,
} from './public.actions';
import {
    clearFlepzData,
    collectAllInboundQueryParams,
    clearSuggestedRegistrationServiceAddressSuggestions,
    setInvalidFirstNameErrorForCredentialSetup,
    setFreeListenCampaign,
    clearFreeListenCampaign,
    collectDeviceActivationCode,
    setDeviceActivationInProgress,
    setDeviceActivationCompleted,
    setIsTokenizationFlow,
    setActivationCode,
    setIsSonosFlow,
} from './actions';

export const featureKey = 'setupCredentialsDirectBilling';
export const selectSetupCredentialsDirectBillingFeatureState = createFeatureSelector<SetupCredentialsDirectBillingState>(featureKey);

export interface SetupCredentialsDirectBillingState {
    flepzData?: FlepzData;
    inboundQueryParams?: { [key: string]: string };
    selectedRadioIdLastFour?: string;
    registrationData?: RegistrationData;
    isAgentLinkScenario?: boolean;
    deviceActivationCode?: string;
    deviceActivationInProgress?: boolean;
    deviceActivationIsForTrial?: boolean;
    isInvalidEmailError?: boolean;
    isInvalidFirstNameError?: boolean;
    freeListenCampaign?: {
        promoCode: string;
        endDate: string;
        isActive: boolean;
    };
    isTokenizationFlow?: boolean;
    isSonosFlow?: boolean;
}
export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface RegistrationData {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    avsvalidated: boolean;
    phoneNumber: string;
    username: string;
    password: string;
    email: string;
    securityQuestionAnswers: SecurityQuestionAnswer[];
}

export interface SecurityQuestionAnswer {
    id: number;
    answer: string;
}

const initialState: SetupCredentialsDirectBillingState = {};

const stateReducer = createReducer(
    initialState,
    on(collectFlepzData, (state, { flepzData }) => ({ ...state, flepzData })),
    on(clearFlepzData, ({ flepzData, ...state }) => state),
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams: { ...state.inboundQueryParams, ...inboundQueryParams } })),
    on(collectSelectedRadioIdLastFour, (state, { selectedRadioIdLastFour }) => ({ ...state, selectedRadioIdLastFour })),
    on(collectRegistrationCredentials, (state, { credentials }) => ({ ...state, registrationData: { ...state.registrationData, ...credentials } })),
    on(collectRegistrationSecurityQuestionAnswers, (state, { securityQuestionAnswers }) => ({
        ...state,
        registrationData: { ...state.registrationData, securityQuestionAnswers },
    })),
    on(collectRegistrationServiceAddressAndPhoneNumber, (state, { addressAndPhone }) => ({ ...state, registrationData: { ...state.registrationData, ...addressAndPhone } })),
    on(clearSuggestedRegistrationServiceAddressSuggestions, (state) => ({ ...state, suggestedRegistrationServiceAddressCorrections: undefined })),
    on(setIsAgentLinkScenario, (state, { isAgentLinkScenario }) => ({ ...state, isAgentLinkScenario })),
    on(collectDeviceActivationCode, (state, { activationCode }) => ({ ...state, deviceActivationCode: activationCode })),
    on(clearDeviceActivationCode, (state) => ({ ...state, deviceActivationCode: undefined })),
    on(setDeviceActivationInProgress, (state) => ({ ...state, deviceActivationInProgress: true })),
    on(setDeviceActivationCompleted, (state) => ({ ...state, deviceActivationCode: undefined, deviceActivationInProgress: undefined, deviceActivationIsForTrial: undefined })),
    on(setDeviceActivationIsForTrial, (state) => ({ ...state, deviceActivationIsForTrial: true })),
    on(setInvalidEmailErrorForCredentialSetup, (state, { isInvalidEmailError }) => ({ ...state, isInvalidEmailError })),
    on(setInvalidFirstNameErrorForCredentialSetup, (state, { isInvalidFirstNameError }) => ({ ...state, isInvalidFirstNameError })),
    on(setFreeListenCampaign, (state, { promoCode, endDate, isActive }) => ({ ...state, freeListenCampaign: { promoCode, endDate, isActive } })),
    on(clearFreeListenCampaign, (state) => ({ ...state, freeListenCampaign: undefined })),
    on(setIsTokenizationFlow, (state) => ({ ...state, isTokenizationFlow: true })),
    on(setActivationCode, (state, { deviceActivationCode }) => ({ ...state, deviceActivationCode: deviceActivationCode })),
    on(setIsSonosFlow, (state, { isSonosFlow }) => ({ ...state, isSonosFlow }))
);

export function reducer(state: SetupCredentialsDirectBillingState, action: Action) {
    return stateReducer(state, action);
}
