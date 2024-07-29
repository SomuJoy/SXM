import { createSelector } from '@ngrx/store';
import { getAccountFirstName, getFirstAccountSubscriptionId, getIsCanada, getIsQuebec } from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getLast4digitsOfRadioId, getOrderQuoteData } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { getAccountEmail } from '@de-care/domains/subscriptions/state-new-account';
import { getRenewalQuote } from '@de-care/domains/quotes/state-quote';
import { getAccountFirstSubscriptionSubscriptionID } from '@de-care/domains/account/state-account';

export const getRegisterData = createSelector(
    getAccountEmail,
    getAccountFirstName,
    getFirstAccountSubscriptionId,
    getSecurityQuestions,
    (email, firstName, subscriptionId, securityQuestions) => ({
        account: { email, useEmailAsUserName: true, firstName, hasUserCredentials: false, hasExistingAccount: false, subscriptionId },
        securityQuestions,
    })
);

export const getConfirmationData = createSelector(
    getLast4digitsOfRadioId,
    getOrderQuoteData,
    getRegisterData,
    getFeatureFlagEnableQuoteSummary,
    getAccountFirstSubscriptionSubscriptionID,
    (last4digitsRadioId, orderQuoteData, registerData, featureFlagEnableQuoteSummary, firstSubscriptionID) => ({
        last4digitsRadioId,
        orderQuoteData,
        registerData,
        featureFlagEnableQuoteSummary,
        firstSubscriptionID,
    })
);

export const getCanadaorQuebecImportantInformationTranslation = createSelector(getIsQuebec, getIsCanada, getRenewalQuote, (isQuebec, isCanada, renewalQuote) => {
    if (isCanada && renewalQuote) {
        return 'deCareUseCasesTrialActivationRtpFeatureConfirmationModule.confirmationComponent.RTP_IMPORTANT_INFO_BODY';
    } else {
        return isQuebec
            ? 'deCareUseCasesTrialActivationRtpFeatureConfirmationModule.confirmationComponent.IMPORTANT_INFO_BODY_QUEBEC'
            : 'deCareUseCasesTrialActivationRtpFeatureConfirmationModule.confirmationComponent.IMPORTANT_INFO_BODY';
    }
});

export { getFirstAccountSubscriptionId as getSubscriptionId } from '@de-care/domains/account/state-account';
