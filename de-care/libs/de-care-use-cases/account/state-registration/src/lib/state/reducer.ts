import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    fetchVerificationOptions,
    fetchVerificationOptionsSettled,
    setFlepzData,
    setInvalidPhoneInFlepz,
    resetInvalidPhoneInFlepz,
    setVerificationMethods,
    submitFlepzData,
    submitFlepzDataSettled,
    setLookupAccountByRadioIdError,
    setLookupAccountByAccountNumberError,
    submitLookupAccountByRadioIdOrAccountNumber,
    submitLookupAccountByRadioIdOrAccountNumberSuccess,
    setCNAFormData,
    setCNAFormDataOnSubmission,
    validateAddressError,
    clearValidateAddresError,
    clearValidateAddresErrorOnModalClose,
    accountAlreadyRegistered,
    setRegistrationDataNeeded,
    accountIsInStepUpScenario,
    setIsEmailAddressOnFileLookup,
    setIsEmailAddressOnFileVerification,
    setMaskedPhoneNumberLookup,
    setMaskedPhoneNumberVerification,
    accountResponseHasNoData,
    accountHasDemoSubscription,
    accountFoundCannotBeVerified,
    submitLookupAccountByRadioIdOrAccountNumberFailed,
    isInCNA,
    fetchVerificationOptionsForOneAccountFound,
    fetchVerificationOptionsWhenInStepUpFlow,
    setVerificationOptionsForNoAccountFound,
    setIsPhoneNumberOnFileVerification,
    accountResponseHasData,
    setUserName,
    setFirstName,
    clearLookupErrors,
    setAccountNotFoundLinkClick,
    resetAccountNotFoundLinkClick,
    setEmailFromAccount,
    setEmailOnAccountFromConfirmation,
    clearEmailFromFlepzWhenNoAccountFound,
    registerAccount,
    setLast4DigitsOfRadioId,
    setLast4DigitsOfAccountNumber,
    getAccountProfileSuccess,
    setIsEmailEligibleForUserName,
    registrationDataReady,
    setUserBehaviorPayload,
    setRegistrationUsernameError,
    setRegistrationSystemError,
    setSystemErrorInFlepz,
    resetSystemErrorInFlepz,
    setRegistrationPasswordInvalid,
    setRegistrationPasswordContainsPiiData,
} from './actions';
import { LookupErrors, RegistrationErrors, RegistrationState } from './models';

export const registrationFeatureKey = 'registration';
export const selectRegistrationState = createFeatureSelector<RegistrationState>(registrationFeatureKey);

export const initialState: RegistrationState = {
    flepzData: null,
    firstName: null,
    userName: null,
    email: null,
    isEmailEligibleForUserName: null,
    maskedPhoneNumber: null,
    last4DgititsSelectedRadioId: null,
    hasEmailAddressOnFile: false,
    hasPhoneNumberOnFile: false,
    systemErrorInFlepz: false,
    invalidPhoneInFlepz: false,

    flepzSubmissionStatus: {
        inProgress: false,
        hasError: false,
    },

    verificationOptionsStatus: {
        inProgress: false,
        hasError: false,
    },

    registrationSubmissionErrorStatus: {
        userNameError: false,
        systemError: false,
    },
    verificationMethods: null,
    lookupErrors: null,
    isInPreTrial: false,
    accountRegistered: false,
    last4DigitsOfAccountNumber: null,
    invalidAccountNumberLookup: false,
    invalidRadioIdLookup: false,
    lookupStatus: 'In Progress',
    CNAStatus: 'In Progress',
    CNAFormData: null,
    securityQuestions: null,
    CNAFormValidationError: null,
    isInStepUpFlow: false,
    lookupFormRadioId: null,
    lookupFormAccountNumber: null,
    accountNotFoundLinkClick: false,
    registrationDataReady: false,
    userBehaviorPayload: null,
};

export const registrationReducer = createReducer(
    initialState,
    on(setFlepzData, (state, { flepzData }) => ({ ...state, flepzData, email: flepzData.email })),

    on(setMaskedPhoneNumberLookup, setMaskedPhoneNumberVerification, (state, action) => ({ ...state, maskedPhoneNumber: action.maskedPhoneNumber || null })),

    on(submitFlepzData, (state) => ({ ...state, flepzData: null, flepzSubmissionStatus: { inProgress: true, hasError: false } })),
    on(submitFlepzDataSettled, (state, { hasError }) => ({
        ...state,
        flepzSubmissionStatus: { inProgress: false, hasError },
    })),

    on(setVerificationMethods, setVerificationOptionsForNoAccountFound, (state, action) => ({
        ...state,
        verificationMethods:
            !action.verificationMethods?.accountNumber?.eligible && !action.verificationMethods?.phone?.eligible && !action.verificationMethods?.radioId?.eligible
                ? null
                : action.verificationMethods,
    })),

    on(fetchVerificationOptions, fetchVerificationOptionsForOneAccountFound, fetchVerificationOptionsWhenInStepUpFlow, (state) => ({
        ...state,
        verificationMethods: null,
        verificationOptionsStatus: { inProgress: true, hasError: false },
    })),
    on(fetchVerificationOptionsSettled, (state, action) => ({
        ...state,
        verificationOptionsStatus: { inProgress: false, hasError: action.hasError },
    })),
    on(accountResponseHasData, (state, { response }) => ({
        ...state,
        userName: response?.userName ?? null,
        firstName: response?.firstName ?? null,
    })),
    on(setUserName, (state, { userName }) => ({
        ...state,
        userName,
    })),
    on(setFirstName, (state, { firstName }) => ({
        ...state,
        firstName,
    })),
    on(setSystemErrorInFlepz, (state) => ({ ...state, systemErrorInFlepz: true })),
    on(resetSystemErrorInFlepz, (state) => ({ ...state, systemErrorInFlepz: false })),
    on(setInvalidPhoneInFlepz, (state) => ({ ...state, invalidPhoneInFlepz: true })),
    on(resetInvalidPhoneInFlepz, (state) => ({ ...state, invalidPhoneInFlepz: false })),
    on(submitLookupAccountByRadioIdOrAccountNumber, (state, { radioId, accountNumber }) => ({
        ...state,
        lookupStatus: 'Loading',
        lookupErrors: null,
        invalidRadioIdLookup: false,
        invalidAccountNumberLookup: false,
        lookupFormRadioId: radioId,
        lookupFormAccountNumber: accountNumber,
    })),
    on(submitLookupAccountByRadioIdOrAccountNumberSuccess, (state, { isInPreTrial, accountRegistered, last4DigitsOfAccountNumber }) => ({
        ...state,
        isInPreTrial,
        accountRegistered,
        last4DigitsOfAccountNumber,
        lookupStatus: 'Complete',
    })),
    on(submitLookupAccountByRadioIdOrAccountNumberFailed, (state) => ({
        ...state,
        lookupStatus: 'In Progress',
    })),
    on(setLookupAccountByRadioIdError, (state) => ({
        ...state,
        lookupErrors: {
            radioIDInvalid: true,
        } as LookupErrors,
    })),
    on(accountResponseHasNoData, (state, { accountNumber, radioID }) => ({
        ...state,
        lookupStatus: 'In Progress',
        lookupErrors: {
            noAccountFoundForAccountNumber: accountNumber,
            radioIDInvalid: radioID,
        } as LookupErrors,
    })),
    on(accountHasDemoSubscription, (state) => ({
        ...state,
        lookupStatus: 'In Progress',
        lookupErrors: {
            ...state.lookupErrors,
            demoAccountFoundAndRadioIsNotBrandedWithTrial: true,
        },
    })),
    on(accountFoundCannotBeVerified, (state) => ({
        ...state,
        lookupStatus: 'In Progress',
        lookupErrors: {
            accountFoundCannotBeVerified: true,
        } as LookupErrors,
    })),
    on(setLookupAccountByAccountNumberError, (state) => ({
        ...state,
        lookupStatus: 'In Progress',
        lookupErrors: {
            noAccountFoundForAccountNumber: true,
        } as LookupErrors,
    })),
    on(validateAddressError, (state, { CNAFormValidationError }) => ({
        ...state,
        CNAFormData: {
            ...state.CNAFormData,
            avsvalidated: CNAFormValidationError.validated,
            serviceAddress: true,
        },
        CNAFormValidationError: CNAFormValidationError,
    })),
    on(setCNAFormDataOnSubmission, (state) => ({
        ...state,
        CNAStatus: 'Loading',
    })),
    on(setCNAFormData, (state, { CNAFormData }) => ({
        ...state,
        CNAFormData,
        firstName: CNAFormData.firstName,
        userName: CNAFormData.email,
        email: CNAFormData.email,
    })),
    on(clearValidateAddresError, (state) => ({
        ...state,
        CNAFormValidationError: null,
        CNAStatus: 'Complete',
    })),
    on(clearValidateAddresErrorOnModalClose, (state) => ({
        ...state,
        CNAFormValidationError: null,
        CNAStatus: 'In Progress',
    })),
    on(accountAlreadyRegistered, (state) => ({
        ...state,
        accountRegistered: true,
    })),
    on(setRegistrationDataNeeded, (state, { registrationDataStillNeeded }) => ({
        ...state,
        registrationDataStillNeeded,
    })),
    on(
        accountIsInStepUpScenario,
        (state, { response: { firstName, userName, last4DigitsOfAccountNumber, hasEmailAddressOnFile, maskedPhoneNumber, hasPhoneNumberOnFile } }) => ({
            ...state,
            firstName,
            userName,
            isInStepUpFlow: true,
            last4DigitsOfAccountNumber,
            hasEmailAddressOnFile,
            hasPhoneNumberOnFile,
            maskedPhoneNumber,
        })
    ),
    on(setIsEmailAddressOnFileLookup, setIsEmailAddressOnFileVerification, (state, { emailOnFile }) => ({ ...state, hasEmailAddressOnFile: emailOnFile })),
    on(setIsPhoneNumberOnFileVerification, (state, { phoneOnFile }) => ({ ...state, hasPhoneNumberOnFile: phoneOnFile })),
    on(isInCNA, (state, { last4DigitsOfAccountNumber, isInPreTrial, accountRegistered }) => ({
        ...state,
        last4DigitsOfAccountNumber,
        isInPreTrial,
        accountRegistered,
    })),
    on(clearLookupErrors, (state) => ({ ...state, lookupErrors: null })),
    on(setAccountNotFoundLinkClick, (state) => ({ ...state, accountNotFoundLinkClick: true })),
    on(resetAccountNotFoundLinkClick, (state) => ({ ...state, accountNotFoundLinkClick: false })),
    on(setEmailFromAccount, setEmailOnAccountFromConfirmation, (state, { email }) => ({ ...state, email })),
    on(clearEmailFromFlepzWhenNoAccountFound, (state) => ({ ...state, email: null })),
    on(registerAccount, (state, { emailData }) => ({
        ...state,
        email: !!emailData?.email ? emailData.email : state.email,
    })),
    on(setLast4DigitsOfRadioId, (state, { last4RadioId }) => ({ ...state, last4DgititsSelectedRadioId: last4RadioId })),
    on(setLast4DigitsOfAccountNumber, (state, { last4DigitsOfAccountNumber }) => ({
        ...state,
        last4DigitsOfAccountNumber,
    })),
    on(getAccountProfileSuccess, (state, { response: { emailOnFile: email, isEmailEligibleForUserName } }) => ({
        ...state,
        email,
        isEmailEligibleForUserName: !!email && email.length > 0 ? isEmailEligibleForUserName : null,
    })),
    on(setIsEmailEligibleForUserName, (state, { valid }) => ({
        ...state,
        isEmailEligibleForUserName: state.isInPreTrial ? valid : state.isEmailEligibleForUserName,
    })),
    on(registrationDataReady, (state) => ({
        ...state,
        registrationDataReady: true,
    })),
    on(setUserBehaviorPayload, (state, { userBehaviorPayload }) => ({
        ...state,
        userBehaviorPayload,
    })),
    on(setRegistrationUsernameError, (state) => ({
        ...state,
        registrationSubmissionErrorStatus: {
            userNameError: true,
        } as RegistrationErrors,
    })),
    on(setRegistrationPasswordInvalid, (state) => ({
        ...state,
        registrationSubmissionErrorStatus: {
            passwordInvalid: true,
        } as RegistrationErrors,
    })),
    on(setRegistrationPasswordContainsPiiData, (state) => ({
        ...state,
        registrationSubmissionErrorStatus: {
            passwordContainsPiiData: true,
        } as RegistrationErrors,
    })),
    on(setRegistrationSystemError, (state) => ({
        ...state,
        registrationSubmissionErrorStatus: {
            systemError: true,
        } as RegistrationErrors,
    }))
);

// Need to wrap in function for AOT
export function reducer(state: RegistrationState, action: Action) {
    return registrationReducer(state, action);
}
