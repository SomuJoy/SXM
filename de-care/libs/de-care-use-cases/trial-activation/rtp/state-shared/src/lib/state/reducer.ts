import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    resetCreateAccountError,
    resetSensitiveAccountFormData,
    saveCreateAccountFormData,
    setCreateAccountError,
    setCreateAccountStepCompleted,
    setIngressValuesForTrialActivationRTP,
    setIsMCPFlow,
    setIsExtRtcFlow,
    setPrepaidRedeemUsed,
    setReviewStepCompleted,
    setSuccessfulTransactionData,
    setSelectedLeadOfferPlanCode,
    setDisplayNuCaptcha,
    setCaptchaValidationProcessing,
    setCaptchaValidationNonProcessing,
    setTransactionId,
} from './actions';
import { initialState, TrialActivationRtpSharedState } from './models';

export const featureKey = 'nouvRtpSharedFeature';
export const selectRtpSharedFeature = createFeatureSelector<TrialActivationRtpSharedState>(featureKey);

export const nouvRtpSharedFeatureReducer = createReducer(
    initialState,

    on(setIngressValuesForTrialActivationRTP, (state, { last4digitsOfRadioId, programCode, usedCarBrandingType, redirectURL }) => ({
        ...state,
        queryParams: {
            last4digitsOfRadioId,
            programCode,
            usedCarBrandingType,
            redirectURL,
        },
    })),

    on(saveCreateAccountFormData, (state, action) => ({ ...state, createAccountFormData: { ...action } })),
    on(resetSensitiveAccountFormData, (state) => ({ ...state })),
    on(setCreateAccountStepCompleted, (state) => ({ ...state, isCreateAccountStepComplete: true })),

    on(setReviewStepCompleted, (state) => ({ ...state, isReviewStepComplete: true })),

    on(setCreateAccountError, (state, { createAccountError }) => ({ ...state, createAccountError, createAccountSubmissionHasError: true })),
    on(resetCreateAccountError, (state) => ({ ...state, createAccountError: null, createAccountSubmissionHasError: false })),
    on(setPrepaidRedeemUsed, (state, action) => ({ ...state, prepaidRedeem: action.prepaidUsed })),
    on(setSuccessfulTransactionData, (state, { isEligibleForRegistration, subscriptionId, radioId, accountNumber }) => ({
        ...state,
        transactionResultsData: { isEligibleForRegistration, subscriptionId, radioId, accountNumber },
    })),
    on(setIsMCPFlow, (state) => ({
        ...state,
        isMCPFlow: true,
    })),
    on(setIsExtRtcFlow, (state) => ({
        ...state,
        isExtRtcFlow: true,
    })),
    on(setSelectedLeadOfferPlanCode, (state, { planCode }) => ({
        ...state,
        selectedLeadOfferPlanCode: planCode,
    })),
    on(setDisplayNuCaptcha, (state) => ({ ...state, displayNucaptcha: true })),
    on(setCaptchaValidationProcessing, (state) => ({ ...state, captchaValidationProcessing: true })),
    on(setCaptchaValidationNonProcessing, (state) => ({ ...state, captchaValidationProcessing: false })),
    on(setTransactionId, (state, { transactionId }) => ({ ...state, transactionId }))
);

// Need to wrap in function for AOT
export function reducer(state: TrialActivationRtpSharedState, action: Action) {
    return nouvRtpSharedFeatureReducer(state, action);
}
