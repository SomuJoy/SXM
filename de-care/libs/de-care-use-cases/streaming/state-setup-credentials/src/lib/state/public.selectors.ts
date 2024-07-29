import { getClosedDeviceSubscription, getEmailId, getFirstAccountSubscription, getMarketingAccountId, getMaskedEmailId } from '@de-care/domains/account/state-account';
import { streamingFlepzLookupSubscriptionsAsArray } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { createSelector } from '@ngrx/store';
import { getInboundQueryParamsAsString, selectFlepzData, selectSelectedSubscription, selectIsAgentLinkScenario, selectFreeListenCampaignInfo } from './selectors';
import { getIsCanadaMode, getLegacyOnboardingBaseUrl } from '@de-care/shared/state-settings';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { selectSetupCredentialsDirectBillingFeatureState } from './reducer';
import { SxmLanguages } from '@de-care/app-common';
export {
    selectFlepzData,
    selectInvalidEmailError,
    selectInvalidFirstNameError,
    selectInboundQueryParamsFreeListenCampaignId,
    getStreamingPlayerLinkTokenInfoViewModel,
    selectFreeListenCampaignInfo,
    getIsTokenizationFlow,
    getIsSonosFlow,
} from './selectors';
export { getSecurityQuestions as getSecurityQuestionsViewModel } from '@de-care/domains/account/state-security-questions';

export const getFreeListenSetupViewModel = createSelector(selectFreeListenCampaignInfo, (freeListenCampaignInfo) => ({
    remainingNumberOfDays: freeListenCampaignInfo.promoCode === 'IOS_DL' || freeListenCampaignInfo.promoCode === 'IOS_DL_CA' ? 3 : 14, // TODO: should we calculate this based on the client side dateTime or should this be coming from microservice?
    endDate: freeListenCampaignInfo?.endDate,
}));

export const getHideChatWithAnAgentLink = createSelector(getLanguage, (lang) => (lang as SxmLanguages) === 'fr-CA');

export const getLookupByLicensePlateAllowed = createSelector(getIsCanadaMode, (isCanadaMode) => !isCanadaMode);

export const getDeviceActivationIsForTrial = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.deviceActivationIsForTrial === true);
export const getDeviceActivationInProgress = createSelector(selectSetupCredentialsDirectBillingFeatureState, (state) => state.deviceActivationInProgress);

export const getRecoverLoginUrl = createSelector(
    getLegacyOnboardingBaseUrl,
    getInboundQueryParamsAsString,
    getIsCanadaMode,
    getLanguage,
    (legacyOnboardingBaseUrl, queryParams, isCanadaMode, lang) => {
        let finalUrl = `${legacyOnboardingBaseUrl}?recoverlogin=true`;
        if (isCanadaMode) {
            const langPref = lang?.split('-')?.[0]?.toLowerCase();
            if (langPref) {
                finalUrl = `${finalUrl}&langpref=${langPref}`;
            }
        }
        return queryParams ? `${finalUrl}&${queryParams}` : finalUrl;
    }
);

export const getCredentialSetupUsernameShouldBeReadonly = createSelector(
    selectIsAgentLinkScenario,
    selectSelectedSubscription,
    (isAgentLinkScenario, subscription) => isAgentLinkScenario && subscription.hasOACCredentials === true
);
export const getCredentialSetupMaskedUsername = createSelector(selectSelectedSubscription, (subscription) => subscription?.streamingService?.maskedUserName);

export const transactionSessionFlepzSubmittedDataExists = createSelector(selectFlepzData, (flepzData) => !!flepzData);
export const getFlepzEmail = createSelector(selectFlepzData, (flepzData) => flepzData?.email.toLowerCase());
export const selectedSubscriptionSessionDataExists = createSelector(selectSelectedSubscription, (subscription) => !!subscription);
export const selectSelectedSubscriptionSummaryViewModel = createSelector(
    selectSelectedSubscription,
    getFirstAccountSubscription,
    getMarketingAccountId,
    getEmailId,
    getMaskedEmailId,
    getClosedDeviceSubscription,
    (selectedSubscriptionFromFlepzLookup, accountSubscription, last4DigitsOfAccountNumber, email, maskedEmail, closedDeviceSubscription) =>
        selectedSubscriptionFromFlepzLookup
            ? mapSubscriptionSummary(selectedSubscriptionFromFlepzLookup, email, maskedEmail)
            : accountSubscription
            ? mapSubscriptionSummary({ ...accountSubscription, last4DigitsOfAccountNumber, email, maskedEmail })
            : closedDeviceSubscription
            ? mapClosedSubscriptionSummary({ ...closedDeviceSubscription, last4DigitsOfAccountNumber, email })
            : null
);

export const selectFlepzSubscriptionsFoundSummaryViewModel = createSelector(streamingFlepzLookupSubscriptionsAsArray, (subscriptions) => {
    const subscriptionsMapped = subscriptions.map((subscription) => ({
        ...mapSubscriptionSummary(subscription),
        ctaType: mapSubscriptionCtaType(subscription),
    }));
    return {
        subscriptionsWithStreaming: subscriptionsMapped
            .filter((sub) => ['CreateLogin', 'ListenNow'].includes(sub.ctaType))
            .sort((prev, next) => {
                if (next.ctaType === 'ListenNow') {
                    return -1;
                }
                if (next.ctaType === 'CreateLogin') {
                    return 1;
                }
                return 0;
            }),
        subscriptionsNeedingUpgrade: subscriptionsMapped.filter((sub) => ['Upgrade'].includes(sub.ctaType)),
        subscriptionsInactive: subscriptionsMapped.filter((sub) => ['Reactivate'].includes(sub.ctaType)),
        subscriptionsNeedingPayment: subscriptionsMapped.filter((sub) => ['MakePayment'].includes(sub.ctaType)),
    };
});
function mapSubscriptionSummary(subscription, email?, maskedEmail?) {
    return {
        last4DigitsOfAccountNumber: subscription.last4DigitsOfAccountNumber,
        last4DigitsOfRadioId: subscription.radioService?.last4DigitsOfRadioId,
        vehicleInfo: minimalVehicleInfoExists(subscription.radioService?.vehicleInfo) ? subscription.radioService?.vehicleInfo : null,
        packageNames: subscription.plans?.map((plan) => plan.packageName),
        eligibilityType: subscription.eligibilityType,
        email: email ? email?.toLowerCase() : subscription.email?.toLowerCase(),
        deviceToken: subscription.deviceToken,
        maskedEmail: maskedEmail ? maskedEmail : subscription.maskedEmail,
    };
}

function mapClosedSubscriptionSummary(subscription, email?, maskedEmail?) {
    return {
        last4DigitsOfAccountNumber: subscription?.last4DigitsOfAccountNumber,
        last4DigitsOfRadioId: subscription?.last4DigitsOfRadioId,
        vehicleInfo: minimalVehicleInfoExists(subscription?.vehicleInfo) ? subscription?.vehicleInfo : null,
        email: email ? email?.toLowerCase() : subscription.email?.toLowerCase(),
        maskedEmail: maskedEmail ? maskedEmail : subscription.maskedEmail,
    };
}

function minimalVehicleInfoExists({ year, make, model }: { year: string | number; make: string; model: string }): boolean {
    return !!year || !!make || !!model;
}

function mapSubscriptionCtaType(subscription): 'Reactivate' | 'Upgrade' | 'CreateLogin' | 'ListenNow' | 'MakePayment' {
    if (subscription.status?.toLowerCase() === 'closed' || subscription.status?.toLowerCase() === 'inactive') {
        return 'Reactivate';
    }
    if (
        subscription.eligibilityType === 'FREE_PREVIEW' &&
        ((subscription.inEligibleReasonCode === null && subscription.eligibleService === 'SXIR_STANDALONE') ||
            (subscription.inEligibleReasonCode?.toLowerCase() === 'insufficientpackage' && subscription.eligibleService === null))
    ) {
        return 'Upgrade';
    }
    if (
        ((subscription.inEligibleReasonCode?.toLowerCase() === 'existingsxir' && !subscription.hasOACCredentials) ||
            subscription.inEligibleReasonCode?.toLowerCase() === 'existingsxirnocredentials') &&
        subscription.eligibilityType === 'CREATE_LOGIN'
    ) {
        return 'CreateLogin';
    }
    if (subscription.inEligibleReasonCode?.toLowerCase() === 'existingsxir' && subscription.hasOACCredentials && subscription.eligibilityType === 'LISTEN_NOW') {
        return 'ListenNow';
    }
    if (
        subscription.eligibilityType === 'FREE_PREVIEW' &&
        subscription.inEligibleReasonCode?.toLowerCase() === 'paymentissues' &&
        subscription.status?.toLowerCase() === 'active'
    ) {
        return 'MakePayment';
    }
}

export const getCredentialsFormViewModel = createSelector(
    selectSetupCredentialsDirectBillingFeatureState,
    selectSelectedSubscriptionSummaryViewModel,
    (state, subscription) => {
        const credentialFormView = { email: false, username: false };
        if (state.isTokenizationFlow && !subscription.maskedEmail) {
            credentialFormView.email = true;
        } else if (!(state.isTokenizationFlow && !subscription.maskedEmail)) {
            credentialFormView.username = true;
        } else {
            credentialFormView.email = true;
        }
        return credentialFormView;
    }
);
