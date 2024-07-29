import { Action, createReducer, on } from '@ngrx/store';
import {
    resetVerificationSession,
    setPendingSecurityCodeVerification,
    setSecurityCodeVerificationCompleted,
    setVerifyTypeSelection,
    setAccountVerificationStatus,
    setRadioIdVerificationStatus,
    phoneVerificationComplete,
    clearVerificationStatus,
    setPhoneVerificationRequestCodeStatus,
    setPhoneVerificationRequestCodeLimitExceeded,
    setResendPhoneCodeRequested,
    resetResendPhoneCodeRequested,
} from './actions';
import { VerifyTypeSelection } from '../data-services/interfaces';

export const featureKey = 'twoFactorAuth';

export interface TwoFactorAuthState {
    phoneMatchesAccount: boolean;
    phoneVerificationRequestComplete: boolean;
    phoneVerificationRequestCodeStatus: string;
    verifyTypeSelection: VerifyTypeSelection;
    isPendingSecurityCodeVerification: boolean;
    accountVerificationStatus: string;
    radioIdVerificationStatus: string;
    accountNumber: string;
    phoneVerificationRequestCodeLimitExceeded: boolean;
    resendCodeRequested: boolean;
}

const initialState: TwoFactorAuthState = {
    phoneMatchesAccount: false,
    phoneVerificationRequestCodeStatus: null,
    phoneVerificationRequestComplete: false,
    verifyTypeSelection: { verifyType: null, identifier: null },
    isPendingSecurityCodeVerification: false,
    accountVerificationStatus: null,
    radioIdVerificationStatus: null,
    accountNumber: null,
    phoneVerificationRequestCodeLimitExceeded: false,
    resendCodeRequested: false,
};

const stateReducer = createReducer(
    initialState,
    on(setVerifyTypeSelection, (state, { verifyTypeSelection }) => ({
        ...state,
        verifyTypeSelection: {
            verifyType: verifyTypeSelection.verifyType,
            identifier: verifyTypeSelection.identifier,
        },
    })),
    on(resetVerificationSession, (state) => ({
        ...state,
        isPendingSecurityCodeVerification: false,
        verifyTypeSelection: {
            verifyType: null,
            identifier: null,
        },
        phoneVerificationRequestComplete: false,
        phoneMatchesAccount: false,
        phoneVerificationRequestCodeStatus: null,
    })),
    on(setPendingSecurityCodeVerification, (state) => ({ ...state, isPendingSecurityCodeVerification: true })),
    on(setSecurityCodeVerificationCompleted, (state) => ({ ...state, isPendingSecurityCodeVerification: false })),
    on(setAccountVerificationStatus, (state, { status, accountNumber }) => ({ ...state, accountVerificationStatus: !!accountNumber ? status : null, accountNumber })),
    on(setRadioIdVerificationStatus, (state, { status }) => ({ ...state, radioIdVerificationStatus: status })),
    on(setPhoneVerificationRequestCodeStatus, (state, { status }) => ({ ...state, phoneVerificationRequestCodeStatus: status })),
    on(phoneVerificationComplete, (state) => ({ ...state, phoneVerificationRequestComplete: true })),
    on(setPhoneVerificationRequestCodeLimitExceeded, (state) => ({ ...state, phoneVerificationRequestCodeLimitExceeded: true })),
    on(setResendPhoneCodeRequested, (state) => ({ ...state, resendCodeRequested: true })),
    on(resetResendPhoneCodeRequested, (state) => ({ ...state, resendCodeRequested: false }))
);

export function reducer(state: TwoFactorAuthState, action: Action) {
    return stateReducer(state, action);
}
