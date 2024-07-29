import { maskEmail, selectAccount } from '@de-care/domains/account/state-account';
import { selectAllCoustomerAccounts, selectTotalAccounts } from '@de-care/domains/account/state-customer-accounts';
import { getLanguage, getLanguagePrefix, getIsCanadaMode } from '@de-care/domains/customer/state-locale';
import { getCountry, sxmCountries, getOACUrl } from '@de-care/shared/state-settings';
import { createSelector } from '@ngrx/store';
import { CredentialsNeededType, FlepzData } from './models';
import { selectRegistrationState } from './reducer';
import { SxmLanguages } from '@de-care/app-common';
import { getVerifyTypeSelection } from '@de-care/domains/account/state-two-factor-auth';
import { selectReuseUserName } from '@de-care/domains/customer/state-customer-verification';

export const hasMultilpleAccounts = createSelector(selectTotalAccounts, (totalAccounts) => totalAccounts && totalAccounts > 1);

export const getCustomerAccounts = createSelector(selectAllCoustomerAccounts, (accounts) =>
    accounts.map((account) => ({
        accountLast4Digits: account.last4DigitsOfAccountNumber,
        subscriptions: account.subscriptions
            .filter((subscription) => subscription.plans && Array.isArray(subscription.plans) && subscription.plans.length > 0)
            .map((subscription) => ({
                plans: Array.from(
                    subscription.plans.filter((plan) => !!plan.packageName),
                    (plan) => plan.packageName
                ),
                vehicle: {
                    year: subscription.radioService?.vehicleInfo?.year,
                    make: subscription.radioService?.vehicleInfo?.make,
                    model: subscription.radioService?.vehicleInfo?.model,
                },
                radioIDLast4Digits: subscription.radioService?.last4DigitsOfRadioId,
                maskedUserName: subscription.streamingService?.maskedUserName,
            })),
    }))
);

export const getPlainCustomersPlansList = createSelector(getCustomerAccounts, (accounts) =>
    accounts.map((account) => ({
        accountLast4Digits: account.accountLast4Digits,
        plan: account?.subscriptions?.map((subsc) => subsc?.plans)?.reduce((accumulator, value) => accumulator?.concat(value), []),
    }))
);

export const getLast4AccountAndRadioId = createSelector(getCustomerAccounts, (customerAccounts) => {
    return ([] as { accLast4: string; ridLast4: string }[]).concat(
        ...customerAccounts?.map((acc) =>
            acc.subscriptions
                ?.filter((subscriptions) => subscriptions.radioIDLast4Digits)
                ?.map((subscription) => ({ accLast4: acc.accountLast4Digits, ridLast4: subscription.radioIDLast4Digits?.toString() }))
        )
    );
});

export const getLast4DgititsSelectedRadioId = createSelector(selectRegistrationState, (state) => state.last4DgititsSelectedRadioId);

export const getCustomerAccountsFirstSubscriptionPlanCodes = createSelector(selectAllCoustomerAccounts, (accounts) => {
    return accounts.map((account) => {
        const firstSubscription = account.subscriptions && Array.isArray(account.subscriptions) && account.subscriptions?.length > 0 ? account.subscriptions[0] : null;
        return {
            accountLast4Digits: account.last4DigitsOfAccountNumber,
            plans: firstSubscription.plans?.map((plan) => ({ code: plan.code })),
        };
    });
});

export const selectIsInPreTrial = createSelector(selectRegistrationState, (state) => state.isInPreTrial);
export const selectAccountIsRegistered = createSelector(selectRegistrationState, (state) => state.accountRegistered);
export const selectAccountRegisteredAndPreTrial = createSelector(selectIsInPreTrial, selectAccountIsRegistered, (isInPreTrial, accountRegistered) => ({
    isInPreTrial,
    accountRegistered,
}));
export const selectAccountIsAlreadyRegistered = createSelector(selectRegistrationState, (state) => state.accountRegistered && !state.isInPreTrial);

export const getIsInBeatTheSoldScenario = createSelector(
    selectAccountIsRegistered,
    selectIsInPreTrial,
    (accountIsRegered: boolean, isInPreTrial: boolean) => !accountIsRegered && isInPreTrial
);

export const getFlepzSubmission = createSelector(selectRegistrationState, (state) => state?.flepzData || null);
export const getCustomerHasAccounts = createSelector(
    selectTotalAccounts,
    getFlepzSubmission,
    (totalAccounts: number, flepzSubmission: FlepzData) => !!flepzSubmission && !!totalAccounts
);
export const getCustomerHasNoAccounts = createSelector(
    selectTotalAccounts,
    getFlepzSubmission,
    (totalAccounts: number, flepzSubmission: FlepzData) => !!flepzSubmission && totalAccounts === 0
);

export const getFlepzSubmissionStatus = createSelector(selectRegistrationState, (state) => state?.flepzSubmissionStatus || null);
export const getIsFlepzSubmissionInProgress = createSelector(getFlepzSubmissionStatus, (flepzSubmissionStatus) => flepzSubmissionStatus?.inProgress || false);

export const getVerificationMethods = createSelector(selectRegistrationState, (state) => state?.verificationMethods || null);
export const fetchVerificationOptionsSettled = createSelector(selectRegistrationState, (state) => state?.verificationMethods || null);

export const getVerificationOptionsStatus = createSelector(selectRegistrationState, (state) => state?.verificationOptionsStatus || null);
export const getVerificationOptionsAvailable = createSelector(
    getVerificationOptionsStatus,
    getVerificationMethods,
    (verificationOptionsStatus, methods) => (!verificationOptionsStatus?.inProgress && !verificationOptionsStatus?.hasError && methods !== null) || false
);

export const getMaskedPhoneNumber = createSelector(selectRegistrationState, (state) => state.maskedPhoneNumber);
export const getCollectEmail = createSelector(selectRegistrationState, (state) => !state.hasEmailAddressOnFile);
export const getCollectPhoneNumber = createSelector(selectRegistrationState, (state) => !state.hasPhoneNumberOnFile);
export const getCanUsePhone = createSelector(getVerificationMethods, (methods) => methods?.phone.eligible && !methods?.phone.verified);
export const getRadioIdOptionAvailable = createSelector(getVerificationMethods, (methods) => methods?.radioId.eligible && !methods?.radioId.verified);
export const getAccountNumberOptionAvailable = createSelector(getVerificationMethods, (methods) => methods?.accountNumber.eligible && !methods?.accountNumber.verified);

export const getIncludeChatWithAnAgentLink = createSelector(getLanguage, (lang) => lang === 'en-CA');

export const getTwoFactorAuthData = createSelector(
    getVerificationOptionsAvailable,
    getMaskedPhoneNumber,
    getRadioIdOptionAvailable,
    getAccountNumberOptionAvailable,
    getCanUsePhone,
    getLast4DgititsSelectedRadioId,
    (isAvailable, maskedPhoneNumber, canUseRadioId, canUseAccountNumber, canUsePhone, last4DigitisRadioId) => {
        if (!isAvailable) {
            return null;
        }
        return {
            verifyOptionsInfo: {
                maskedPhoneNumber,
                canUseRadioId,
                canUseAccountNumber,
                canUsePhone,
            },
            last4DigitisRadioId,
        };
    }
);

// TODO: refactor out these form submission error flags from the feature state and instead get them from a synchronous workflow call
export const getFlepzSubmissionHasSystemError = createSelector(selectRegistrationState, (state) => state.systemErrorInFlepz);
export const getFlepzSubmissionHasInvalidPhone = createSelector(selectRegistrationState, (state) => state.invalidPhoneInFlepz);
export const getIsUS = createSelector(getIsCanadaMode, (state) => !state);
export const getHasInvalidRadioIdLookupError = createSelector(selectRegistrationState, (state) => state.invalidRadioIdLookup);
export const getHasInvalidAccountNumberLookupError = createSelector(selectRegistrationState, (state) => state.invalidAccountNumberLookup);
export const getUserName = createSelector(selectRegistrationState, (state) => state?.userName);

export const getFlepzEmail = createSelector(selectRegistrationState, (state) => state?.flepzData?.email);
export const getCNAFormData = createSelector(selectRegistrationState, (state) => state?.CNAFormData);
export const getAccountEmail = createSelector(selectRegistrationState, (state) => state?.email);
export const getEmailForUserName = createSelector(getAccountEmail, getFlepzEmail, (accountEmail, flepzEmail) => accountEmail || flepzEmail);

export const getCNAFormDataAndEmail = createSelector(getCNAFormData, getAccountEmail, (cnaData, email) => ({ cnaData, email }));
export const getUsernameForPreFill = createSelector(getUserName, (userName) => userName);
export const getUserNameForDisplay = createSelector(getUserName, (userName) => userName && maskEmail(userName));
export const getUserNameFormats = createSelector(getUserNameForDisplay, getUsernameForPreFill, (display, preFill) => ({
    display,
    preFill,
}));

export const selectIsInStepUpFlow = createSelector(selectRegistrationState, (state) => state.isInStepUpFlow);
export const getShouldCollectReuseUsername = createSelector(selectReuseUserName, (reuse) => !!reuse && reuse);
export const getReuseUsernameIsUndefined = createSelector(selectReuseUserName, (reuse) => !!!reuse);
export const getIsEmailEligibleForReuse = createSelector(selectRegistrationState, (state) => !!state.isEmailEligibleForUserName && state.isEmailEligibleForUserName);
export const getShouldNotCollectUsername = createSelector(
    getShouldCollectReuseUsername,
    getIsEmailEligibleForReuse,
    getIsInBeatTheSoldScenario,
    getReuseUsernameIsUndefined,
    (reuse, emailReuse, beatTheSold, reuseUndefined) => (beatTheSold ? !reuse : (!reuse && emailReuse) || (reuseUndefined && emailReuse))
);
export const getShouldCollectUsername = createSelector(getShouldNotCollectUsername, (shouldNotCollectUsername) => !shouldNotCollectUsername);
export const selectIsNotInStepUpFlow = createSelector(selectIsInStepUpFlow, (isInStepUp) => !isInStepUp);
export const getFormDataReady = createSelector(selectRegistrationState, (state) => state?.registrationDataReady);
export const buildLoginCredentials = createSelector(selectIsInStepUpFlow, getShouldCollectUsername, (stepUp, shouldCollectUsername) =>
    stepUp ? CredentialsNeededType.none : shouldCollectUsername ? CredentialsNeededType.usernameAndPassword : CredentialsNeededType.password
);

export const getRegistrationDataNeeded = createSelector(
    getCollectEmail,
    getCollectPhoneNumber,
    getFlepzSubmission,
    selectIsInPreTrial,
    buildLoginCredentials,
    getFormDataReady,
    (email, phoneNumber, flepz, inPreTrial, loginCredentials, ready) => ({
        emailPreFill: flepz?.email,
        phonePreFill: flepz?.phoneNumber,
        email: email ? (inPreTrial ? false : true) : false,
        phoneNumber: phoneNumber ? (inPreTrial ? false : true) : false,
        securityQuestions: true,
        loginCredentials,
        ready,
    })
);

export const getCNAFormValidationError = createSelector(selectRegistrationState, (state) => state.CNAFormValidationError);

export const getLookupFormData = createSelector(getLanguage, getCountry, (language: SxmLanguages, country: sxmCountries) => ({ language, country }));

export const getCNAFormPreFillData = createSelector(getFlepzSubmission, getLanguage, getCountry, (flepz: FlepzData, language: SxmLanguages, country: sxmCountries) => ({
    flepz,
    language,
    country,
}));

export const getCNADataAVS = createSelector(selectRegistrationState, (state) => ({
    avsvalidated: state?.CNAFormData?.avsvalidated,
    serviceAddress: state?.CNAFormData?.serviceAddress,
}));

export const lookupStatus = createSelector(selectRegistrationState, (state) => state.lookupStatus);

export const lookupIsLoading = createSelector(lookupStatus, (status) => status === 'Loading');

export const cnaStatus = createSelector(selectRegistrationState, (state) => state.CNAStatus);

export const cnaIsLoading = createSelector(cnaStatus, (status) => status === 'Loading');
export const getFirstName = createSelector(selectRegistrationState, (state) => state?.firstName.charAt(0).toUpperCase() + state?.firstName.slice(1));

export const selectLookupErrors = createSelector(selectRegistrationState, (state) => state.lookupErrors);
export const selectLast4DigitsOfAccountNumber = createSelector(selectRegistrationState, (state) => state.last4DigitsOfAccountNumber);
export const selectVerifyPageGuard = createSelector(getCustomerHasAccounts, selectIsInStepUpFlow, (hasAccounts: boolean, isInStepUp: boolean) => hasAccounts || isInStepUp);
export const getVerificationOptionsAvailableAndTwoFactorAuthData = createSelector(
    getVerificationOptionsAvailable,
    getTwoFactorAuthData,
    (verificationOptionsAvailable, twoFactorAuthData) => ({ verificationOptionsAvailable, twoFactorAuthData })
);

export const getVerificationStatus = createSelector(selectRegistrationState, (state) => state?.verificationOptionsStatus?.inProgress);

export const selectIsStepUpFlowWithLast4OfAccountNumber = createSelector(
    selectIsInStepUpFlow,
    selectLast4DigitsOfAccountNumber,
    getTwoFactorAuthData,
    (isInStepUpFlow, last4DigitsOfAccountNumber, twoFactorAuthData) => ({
        isInStepUpFlow,
        last4DigitsOfAccountNumber,
        twoFactorAuthData,
    })
);

export const getHasFlepzDataOrInStepUp = createSelector(getFlepzSubmission, selectIsInStepUpFlow, (flepz, inStepUp) => ({ flepz, inStepUp }));

export const getRequestAccountDataFromLookupForm = createSelector(selectRegistrationState, getFlepzSubmission, (state, flepz) => ({
    ...(state.lookupFormRadioId && { radioId: state.lookupFormRadioId }),
    ...(state.lookupFormAccountNumber && { accountNumber: state.lookupFormAccountNumber }),
    ...(!!flepz?.lastName && !state.lookupFormAccountNumber && { lastName: flepz?.lastName }),
}));

export const getRequestAccountDataFromVerifyForm = createSelector(getVerifyTypeSelection, getFlepzSubmission, (verifyInfo, flepz) => ({
    ...(verifyInfo.verifyType === 'radioId' && { radioId: verifyInfo.identifier }),
    ...(verifyInfo.verifyType === 'accountNumber' && { accountNumber: verifyInfo.identifier }),
    ...(!!flepz?.lastName && !(verifyInfo.verifyType === 'accountNumber') && { lastName: flepz?.lastName }),
}));

export const getRequestToGetAccountInformation = createSelector(
    getVerifyTypeSelection,
    getRequestAccountDataFromLookupForm,
    getRequestAccountDataFromVerifyForm,
    (checkVerify, requestFromLookupForm, requestFromVerifyForm) => (!!checkVerify.identifier ? requestFromVerifyForm : requestFromLookupForm)
);

export const getAccountNotFoundLinkClicked = createSelector(selectRegistrationState, (state) => state.accountNotFoundLinkClick);
export const getAcountInfoIsAvailable = createSelector(
    selectAccount,
    selectTotalAccounts,
    getAccountNotFoundLinkClicked,
    (accountLoaded, accountsLoadedByFlepz, accountNotFoundClicked) => (!!accountLoaded || !!accountsLoadedByFlepz) && !accountNotFoundClicked
);

export const getRegistrationGuard = createSelector(getAcountInfoIsAvailable, getIsInBeatTheSoldScenario, (accountInfo, isInBeatTheSoldScenario) => ({
    accountInfo,
    isInBeatTheSoldScenario,
}));

export const getAccountProfileRequest = createSelector(selectLast4DigitsOfAccountNumber, (last4DigitsOfAccountNumber) => ({
    last4DigitsOfAccountNumber,
    radioId: '',
}));

export const getEmailAndIsEmailEligibleForUserName = createSelector(selectRegistrationState, getIsInBeatTheSoldScenario, (state, isInBeatTheSold) => ({
    email: state.email,
    isEmailEligibleForUserName: state.isEmailEligibleForUserName || isInBeatTheSold,
}));

export const selectBeatTheSoldAndStepUp = createSelector(getIsInBeatTheSoldScenario, selectIsInStepUpFlow, (beatTheSold, stepUp) => ({ beatTheSold, stepUp }));
export const getUserNameForLogin = createSelector(selectRegistrationState, (state) => state.userName || state.email || null);
export const getUserBehaviorPayloadForLogin = createSelector(selectRegistrationState, (state) => state.userBehaviorPayload || null);
export const getUserNameAndNuDetectDataForLoginAndIsStepUp = createSelector(
    getUserNameForLogin,
    getUserBehaviorPayloadForLogin,
    selectIsInStepUpFlow,
    (userNameForLogin, userBehaviorPayloadForLogin, isInStepUp) => ({ userNameForLogin, userBehaviorPayloadForLogin, isInStepUp })
);

export const oacLoginUrlWithLang = createSelector(
    getOACUrl,
    getLanguagePrefix,
    (oacBaseUrl, langPrefix) => oacBaseUrl + 'login_view.action?reset=true&langpref=' + langPrefix
);

export const getRegistrationSubmissionErrorStatus = createSelector(selectRegistrationState, (state) => state.registrationSubmissionErrorStatus);
