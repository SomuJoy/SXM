import { createSelector } from '@ngrx/store';
import { Platform, selectSetupCredentialsFeatureState } from './reducer';
import { getAccountSubscriptions, getEmailId, getMarketingAccountId } from '@de-care/domains/account/state-account';
import { streamingFlepzLookupSubscriptionsAsArray } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getTwoFactorAuthData, getVerificationOptionsAvailable } from '@de-care/domains/account/state-register-widget';

export const selectFlepzData = createSelector(selectSetupCredentialsFeatureState, (state) => state.flepzData);
export const selectLPZData = createSelector(selectFlepzData, (flepzData) => {
    if (flepzData) {
        const { lastName, phoneNumber, zipCode } = flepzData;
        return { lastName, phoneNumber, zipCode };
    } else {
        return null;
    }
});
export const selectPlatform = createSelector(selectSetupCredentialsFeatureState, ({ platform }) => platform);
export const selectSelectedRadioIdLastFour = createSelector(selectSetupCredentialsFeatureState, ({ selectedRadioIdLastFour }) => selectedRadioIdLastFour);
export const selectInvalidEmailError = createSelector(selectSetupCredentialsFeatureState, ({ isInvalidEmailError }) => isInvalidEmailError);
export const selectInvalidFirstNameError = createSelector(selectSetupCredentialsFeatureState, ({ isInvalidFirstNameError }) => isInvalidFirstNameError);
export const clearInvalidEmailError = createSelector(selectSetupCredentialsFeatureState, ({ isInvalidEmailError }) => (isInvalidEmailError = false));
export const clearInvalidFirstNameError = createSelector(selectSetupCredentialsFeatureState, ({ isInvalidFirstNameError }) => (isInvalidFirstNameError = false));

export const selectRedirectResponsePayloadForPreview = createSelector(selectPlatform, (platform) => mapToWidgetInterface(platform, 'BacktoWelcome'));
export const selectRedirectRequestPayloadForSignIn = createSelector(selectPlatform, (platform) => mapToWidgetInterface(platform, 'BacktoSignInOverlay'));
export const selectRequestPayloadForOpenPrivacyPolicy = createSelector(selectPlatform, (platform) => mapToWidgetInterface(platform, 'openPrivacyPolicy'));

export const selectRegistrationDataForSubmission = createSelector(selectSetupCredentialsFeatureState, selectFlepzData, ({ registrationData }, flepzData) => ({
    userName: registrationData.username,
    password: registrationData.password,
    securityQuestions: _mapSecurityQuestionValues(registrationData.securityQuestionAnswers),
    cna: {
        firstName: flepzData.firstName,
        lastName: flepzData.lastName,
        email: flepzData.email,
        phone: registrationData.phoneNumber,
        address: {
            avsvalidated: registrationData.avsvalidated,
            streetAddress: registrationData.addressLine1,
            city: registrationData.city,
            state: registrationData.state,
            postalCode: registrationData.zip,
        },
    },
}));

export const selectSuggestedRegistrationServiceAddressCorrections = createSelector(
    selectSetupCredentialsFeatureState,
    (state) => state.suggestedRegistrationServiceAddressCorrections
);

export const selectInboundQueryParams = createSelector(selectSetupCredentialsFeatureState, (state) => state.inboundQueryParams);

const selectSelectedSubscriptionFromAccountData = createSelector(
    getMarketingAccountId,
    getEmailId,
    getAccountSubscriptions,
    selectSelectedRadioIdLastFour,
    (accountNumber, email, subscriptions, radioIdLastFour) => {
        const sub = subscriptions?.find((subscription) => subscription.radioService?.last4DigitsOfRadioId === radioIdLastFour);
        return sub
            ? {
                  ...sub,
                  last4DigitsOfAccountNumber: accountNumber,
                  email,
              }
            : null;
    }
);

const selectSelectedSubscriptionFromFlepzLookup = createSelector(streamingFlepzLookupSubscriptionsAsArray, selectSelectedRadioIdLastFour, (subscriptions, radioIdLastFour) =>
    subscriptions.find((subscription) => subscription.radioService?.last4DigitsOfRadioId === radioIdLastFour)
);

export const selectSelectedSubscription = createSelector(
    selectSelectedSubscriptionFromAccountData,
    selectSelectedSubscriptionFromFlepzLookup,
    (accountSubscription, flepzSubscription) => (accountSubscription ? accountSubscription : flepzSubscription)
);
const getSelectedSubscriptionId = createSelector(selectSelectedSubscription, (subscription) => subscription?.id);
export const getStreamingPlayerLinkTokenInfoViewModel = createSelector(getSelectedSubscriptionId, (subscriptionId) => ({ subscriptionId }));

function mapToWidgetInterface(deviceType: Platform, handleEvent: 'BacktoWelcome' | 'BacktoSignInOverlay' | 'openPrivacyPolicy') {
    return {
        actionType: { handleEvent },
        deviceDetails: { deviceType },
        authorizationDetails: { access_Token: '', refresh_Token: '' },
        eventDetails: { deepLinkingInfo: '' },
    };
}

function _mapSecurityQuestionValues(value) {
    return [
        {
            id: value.question1,
            answer: value.answer1,
        },
        {
            id: value.question2,
            answer: value.answer2,
        },
        {
            id: value.question3,
            answer: value.answer3,
        },
    ];
}
export const getQueryParams = createSelector(getNormalizedQueryParams, (queryParams) => queryParams);
export const getSrcQueryParam = createSelector(getNormalizedQueryParams, (queryParam) => {
    if (queryParam?.src === queryParam?.source) {
        return queryParam?.src;
    } else if (queryParam?.src) {
        return queryParam?.src;
    } else if (queryParam?.source) {
        return queryParam?.source;
    } else {
        return null;
    }
});

export const getAllAccounts = createSelector(selectSetupCredentialsFeatureState, (state) => state?.account || null);

export const getUpdatePasswordUsername = createSelector(selectSetupCredentialsFeatureState, (state) => state?.sxmUsername);

export const getInboundQueryParamsPasswordResetToken = createSelector(getNormalizedQueryParams, (queryParams) =>
    queryParams?.tkn ? queryParams?.tkn : queryParams?.updatepwdtoken
);
export const getVerificationOptionsAvailableAndTwoFactorAuthData = createSelector(
    getVerificationOptionsAvailable,
    getTwoFactorAuthData,
    (verificationOptionsAvailable, twoFactorAuthData) => ({ verificationOptionsAvailable, twoFactorAuthData })
);

export const getAccountDataBySource = createSelector(getAllAccounts, (accounts) => {
    if (accounts) {
        accounts = accounts.map((x) => ({ ...x, canUsePhone: false, canUseEmail: false, accountType: '', subscription: [] }));
        return accounts;
    }
});

export const getEmailSentMaskedEmailId = createSelector(selectSetupCredentialsFeatureState, (state) => state?.maskedEmailId);
export const getSelectedAccount = createSelector(selectSetupCredentialsFeatureState, (state) => state?.selectedAccount);
export const getResetPasswordUsername = createSelector(selectSetupCredentialsFeatureState, (state) => state?.userName);
export const getResetToken = createSelector(selectSetupCredentialsFeatureState, (state) => state?.resetToken);
export const getResetPasswordAccountType = createSelector(selectSetupCredentialsFeatureState, (state) => state?.tokenAccountType);
export const getMaskedPhoneNumber = createSelector(selectSetupCredentialsFeatureState, (state) => state?.maskedPhoneNumber);
export const getTokenValidation = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isTokenInvalid);
export const getUpdatePasswordAccountType = createSelector(getQueryParams, (state) => state?.type);
export const getIsUsernameSameAsEmail = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isUsernameSameAsemail);
export const getIsRecoverUsernameFlow = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isRecoverUsernameFlow);
export const getUserEnteredEmailOrUsername = createSelector(selectSetupCredentialsFeatureState, (state) => state.userEnteredEmailOrUsername);
export const getIsCredentialRecoveryFlow = createSelector(selectSetupCredentialsFeatureState, (data) => data.isCredentialRecoveryFlow);
export const getUserEnteredEmailAndLastname = createSelector(selectSetupCredentialsFeatureState, (state) => state.userEnteredEmail && state.userEnteredLastname);
