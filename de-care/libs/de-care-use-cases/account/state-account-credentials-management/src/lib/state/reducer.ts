import { Action, createReducer, createFeatureSelector, on } from '@ngrx/store';
import {
    setResetTokenUserName,
    setAccountsData,
    setMaskedEmailIdForEmailConfirmation,
    setSelectedAccount,
    setResetTokenAccountData,
    setTokenValidity,
    setMaskedPhoneNumber,
    collectAllInboundQueryParams,
    collectPlatformAndSource,
    setIsUsernameSameAsemail,
    setIsRecoverUsernameFlow,
    setUserEnteredEmailOrUsername,
    setUserEnteredEmailAndLastName,
    clearUserEnteredEmailOrUsername,
    clearUserEnteredEmailAndLastName,
    setIsCredentialRecoveryFlow,
    setOrganicAccountType,
} from './actions';

export const featureKey = 'recoveryCredentials';
export const selectSetupCredentialsFeatureState = createFeatureSelector<SetupCredentialsState>(featureKey);

export interface SetupCredentialsState {
    selectedRadioIdLastFour?: string;
    account?: any;
    userName?: string;
    maskedEmailId?: string;
    canUsePhone?: boolean;
    canUseEmail?: boolean;
    maskedEmailIdForVerification?: string;
    maskedPhoneForVerification?: any;
    selectedAccount?: any;
    resetToken?: any;
    tokenAccountType?: any;
    isTokenInvalid?: boolean;
    maskedPhoneNumber?: any;
    inboundQueryParams?: { [key: string]: string };
    platform?: Platform;
    source?: Source;
    isUsernameSameAsemail?: boolean;
    isRecoverUsernameFlow?: boolean;
    userEnteredEmailOrUsername?: any;
    userEnteredEmail?: any;
    userEnteredLastname?: any;
    isCredentialRecoveryFlow?: boolean;
    organicAccountType?: any;
}

export type Platform = 'android' | 'ios' | 'web';
export type Source = 'player' | 'everest';

const initialState: SetupCredentialsState = {};

const stateReducer = createReducer(
    initialState,
    on(setAccountsData, (state, { account }) => ({ ...state, account })),
    on(setResetTokenUserName, (state, { userName }) => ({ ...state, userName })),
    on(setMaskedEmailIdForEmailConfirmation, (state, { maskedEmailId }) => ({ ...state, maskedEmailId })),
    on(setSelectedAccount, (state, { selectedAccount }) => ({ ...state, selectedAccount })),
    on(setResetTokenAccountData, (state, { resetToken, tokenAccountType }) => ({ ...state, resetToken, tokenAccountType })),
    on(setTokenValidity, (state, { isTokenInvalid }) => ({ ...state, isTokenInvalid })),
    on(setMaskedPhoneNumber, (state, { maskedPhoneNumber }) => ({ ...state, maskedPhoneNumber })),
    on(setIsUsernameSameAsemail, (state, { isUsernameSameAsemail }) => ({ ...state, isUsernameSameAsemail })),
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams })),
    on(setIsRecoverUsernameFlow, (state, { isRecoverUsernameFlow }) => ({ ...state, isRecoverUsernameFlow })),
    on(setUserEnteredEmailOrUsername, (state, { userEnteredEmailOrUsername }) => ({ ...state, userEnteredEmailOrUsername })),
    on(setOrganicAccountType, (state, { organicAccountType }) => ({ ...state, organicAccountType })),
    on(setUserEnteredEmailAndLastName, (state, { userEnteredEmail, userEnteredLastname }) => ({ ...state, userEnteredEmail, userEnteredLastname })),
    on(clearUserEnteredEmailOrUsername, (state) => ({ ...state, userEnteredEmailOrUsername: undefined })),
    on(clearUserEnteredEmailAndLastName, (state) => ({ ...state, userEnteredEmail: undefined, userEnteredLastname: undefined })),
    on(setIsCredentialRecoveryFlow, (state) => ({ ...state, isCredentialRecoveryFlow: true })),
    on(collectPlatformAndSource, (state, { platform, source }) => ({
        ...state,
        platform,
        source,
    }))
);

export function reducer(state: SetupCredentialsState, action: Action) {
    return stateReducer(state, action);
}
