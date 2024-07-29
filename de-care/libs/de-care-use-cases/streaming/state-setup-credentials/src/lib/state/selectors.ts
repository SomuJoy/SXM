import { getAccountSubscriptions, getEmailId, getMarketingAccountId } from '@de-care/domains/account/state-account';
import { streamingFlepzLookupSubscriptionsAsArray } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { createSelector } from '@ngrx/store';
import { selectSetupCredentialsDirectBillingFeatureState } from './reducer';

export const selectFreeListenCampaignInfo = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.freeListenCampaign);
export const selectDeviceActivationCode = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.deviceActivationCode);
export const selectDeviceActivationInProgress = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.deviceActivationInProgress === true);
export const selectIsAgentLinkScenario = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.isAgentLinkScenario);
export const selectInboundQueryParams = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.inboundQueryParams);
export const selectInboundQueryParamsFreeListenCampaignId = createSelector(selectInboundQueryParams, ({ campaign }) => campaign);
export const selectInboundQueryParamsPasswordResetToken = createSelector(selectInboundQueryParams, ({ resettoken: resetToken }) => resetToken);
export const getInboundQueryParamsAsString = createSelector(selectInboundQueryParams, (inboundQueryParams) => {
    let queryParamsAsString = '';
    Object.keys(inboundQueryParams).forEach((key, index) => {
        if (index > 0) {
            queryParamsAsString += '&';
        }
        queryParamsAsString += `${key}=${inboundQueryParams[key]}`;
    });
    return queryParamsAsString;
});
export const selectFlepzData = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.flepzData);
export const selectLPZData = createSelector(selectFlepzData, (flepzData) => {
    if (flepzData) {
        const { lastName, phoneNumber, zipCode } = flepzData;
        return { lastName, phoneNumber, zipCode };
    } else {
        return null;
    }
});
export const selectSelectedRadioIdLastFour = createSelector(selectSetupCredentialsDirectBillingFeatureState, ({ selectedRadioIdLastFour }) => selectedRadioIdLastFour);
export const selectInvalidEmailError = createSelector(selectSetupCredentialsDirectBillingFeatureState, ({ isInvalidEmailError }) => isInvalidEmailError);
export const selectInvalidFirstNameError = createSelector(selectSetupCredentialsDirectBillingFeatureState, ({ isInvalidFirstNameError }) => isInvalidFirstNameError);

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

export const selectRegistrationDataForSubmission = createSelector(selectSetupCredentialsDirectBillingFeatureState, selectFlepzData, ({ registrationData }, flepzData) => ({
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

const getSelectedSubscriptionId = createSelector(selectSelectedSubscription, (subscription) => subscription?.id);
export const getStreamingPlayerLinkTokenInfoViewModel = createSelector(getSelectedSubscriptionId, (subscriptionId) => ({ subscriptionId }));

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

export const getIsTokenizationFlow = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.isTokenizationFlow);
export const getIsSonosFlow = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.isSonosFlow);
