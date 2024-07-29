import {
    collectRegistrationCredentials,
    collectRegistrationSecurityQuestionAnswers,
    collectRegistrationServiceAddressAndPhoneNumber,
    setInvalidEmailErrorForCredentialSetup,
    setInvalidFirstNameErrorForCredentialSetup,
    setResetTokenUserAccountType,
    setResetTokenUsername,
    setResetTokenAccountData,
    setIsRecoverUsernameFlow,
    setUserEnteredEmailOrUsername,
    setUserEnteredEmailAndLastName,
    clearUserEnteredEmailOrUsername,
    clearUserEnteredEmailAndLastName,
    setIsCredentialRecoveryFlow,
} from './public.actions';
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    clearFlepzData,
    clearRegistrationData,
    clearSuggestedRegistrationServiceAddressSuggestions,
    collectAllInboundQueryParams,
    collectFlepzData,
    collectPlatformAndSource,
    collectSelectedRadioIdLastFour,
    setAccountsData,
    setSuggestedRegistrationServiceAddressSuggestions,
    setMaskedEmailIdForEmailConfirmation,
    setSelectedAccount,
    setMaskedPhoneNumber,
    setTokenValidity,
    setResetTokenUserName,
    setIsUsernameSameAsemail,
} from './actions';

export const featureKey = 'setupCredentials';
export const selectSetupCredentialsFeatureState = createFeatureSelector<SetupCredentialsState>(featureKey);

export interface SetupCredentialsState {
    flepzData?: FlepzData;
    updateSXIRData?: UpdateSXIRData;
    platform?: Platform;
    source?: Source;
    registrationData?: RegistrationData;
    suggestedRegistrationServiceAddressCorrections?: {
        correctedAddresses: { addressLine1: string; city: string; state: string; zip: string }[];
        addressCorrectionAction: number;
        correctedAddressIsAvsValidated: boolean;
    };
    inboundQueryParams?: { [key: string]: string };
    selectedRadioIdLastFour?: string;
    isInvalidEmailError?: boolean;
    isInvalidFirstNameError?: boolean;
    account?: any;
    accountType?: string;
    sxmUsername?: string;
    maskedEmailId?: string;
    canUsePhone?: boolean;
    canUseEmail?: boolean;
    maskedEmailIdForVerification?: string;
    maskedPhoneForVerification?: any;
    selectedAccount?: any;
    resetToken?: any;
    tokenAccountType?: any;
    userName?: string;
    maskedPhoneNumber?: any;
    isTokenInvalid?: boolean;
    isUsernameSameAsemail?: boolean;
    isRecoverUsernameFlow?: boolean;
    userEnteredEmailOrUsername?: any;
    userEnteredEmail?: any;
    userEnteredLastname?: any;
    isCredentialRecoveryFlow?: boolean;
}
export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}
export type Platform = 'android' | 'ios' | 'unknown';
export type Source = 'player' | 'everest';

export interface UpdateSXIRData {
    radioId: string;
    username: string;
    password: string;
    email: string;
    synchronizeAccountEmail: Boolean;
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

const initialState: SetupCredentialsState = {};

const stateReducer = createReducer(
    initialState,
    on(collectFlepzData, (state, { flepzData }) => ({ ...state, flepzData })),
    on(clearFlepzData, ({ flepzData, ...state }) => state),
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams })),
    on(collectPlatformAndSource, (state, { platform, source }) => ({
        ...state,
        platform,
        source,
    })),
    on(clearRegistrationData, (state) => ({ ...state, registrationData: undefined })),
    on(collectRegistrationServiceAddressAndPhoneNumber, (state, { addressAndPhone }) => ({ ...state, registrationData: { ...state.registrationData, ...addressAndPhone } })),
    on(collectRegistrationCredentials, (state, { credentials }) => ({ ...state, registrationData: { ...state.registrationData, ...credentials } })),
    on(collectRegistrationSecurityQuestionAnswers, (state, { securityQuestionAnswers }) => ({
        ...state,
        registrationData: { ...state.registrationData, securityQuestionAnswers },
    })),
    on(setSuggestedRegistrationServiceAddressSuggestions, (state, { correctedAddresses, addressCorrectionAction, correctedAddressIsAvsValidated }) => ({
        ...state,
        suggestedRegistrationServiceAddressCorrections: { correctedAddresses, addressCorrectionAction, correctedAddressIsAvsValidated },
    })),
    on(clearSuggestedRegistrationServiceAddressSuggestions, (state) => ({ ...state, suggestedRegistrationServiceAddressCorrections: undefined })),
    on(collectSelectedRadioIdLastFour, (state, { selectedRadioIdLastFour }) => ({ ...state, selectedRadioIdLastFour })),
    on(setInvalidEmailErrorForCredentialSetup, (state, { isInvalidEmailError }) => ({ ...state, isInvalidEmailError })),
    on(setInvalidFirstNameErrorForCredentialSetup, (state, { isInvalidFirstNameError }) => ({ ...state, isInvalidFirstNameError })),
    on(setAccountsData, (state, { account }) => ({ ...state, account })),
    on(setResetTokenUserAccountType, (state, { accountType }) => ({ ...state, accountType })),
    on(setResetTokenUsername, (state, { sxmUsername }) => ({ ...state, sxmUsername })),
    on(setMaskedEmailIdForEmailConfirmation, (state, { maskedEmailId }) => ({ ...state, maskedEmailId })),
    on(setSelectedAccount, (state, { selectedAccount }) => ({ ...state, selectedAccount })),
    on(setResetTokenAccountData, (state, { resetToken, tokenAccountType }) => ({ ...state, resetToken, tokenAccountType })),
    on(setMaskedPhoneNumber, (state, { maskedPhoneNumber }) => ({ ...state, maskedPhoneNumber })),
    on(setIsUsernameSameAsemail, (state, { isUsernameSameAsemail }) => ({ ...state, isUsernameSameAsemail })),
    on(setTokenValidity, (state, { isTokenInvalid }) => ({ ...state, isTokenInvalid })),
    on(setResetTokenUserName, (state, { userName }) => ({ ...state, userName })),
    on(setIsRecoverUsernameFlow, (state, { isRecoverUsernameFlow }) => ({ ...state, isRecoverUsernameFlow })),
    on(setUserEnteredEmailOrUsername, (state, { userEnteredEmailOrUsername }) => ({ ...state, userEnteredEmailOrUsername })),
    on(setUserEnteredEmailAndLastName, (state, { userEnteredEmail, userEnteredLastname }) => ({ ...state, userEnteredEmail, userEnteredLastname })),
    on(clearUserEnteredEmailOrUsername, (state) => ({ ...state, userEnteredEmailOrUsername: undefined })),
    on(clearUserEnteredEmailAndLastName, (state) => ({ ...state, userEnteredEmail: undefined, userEnteredLastname: undefined })),
    on(setIsCredentialRecoveryFlow, (state) => ({ ...state, isCredentialRecoveryFlow: true }))
);

export function reducer(state: SetupCredentialsState, action: Action) {
    return stateReducer(state, action);
}
