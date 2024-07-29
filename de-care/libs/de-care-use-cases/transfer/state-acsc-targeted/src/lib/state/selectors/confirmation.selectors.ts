import { createSelector } from '@ngrx/store';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import {
    getAccountEmail,
    getAccountFirstName,
    getAccountSelectedSubscriptionId,
    getIsEligibleForRegistration,
    getIsClosedRadio,
} from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getIsUserNameSameAsEmail, getSelectedSubscriptionIDForSAL } from './state.selectors';

export const getRegisterData = createSelector(
    getAccountEmail,
    getAccountFirstName,
    getAccountSelectedSubscriptionId,
    getSecurityQuestions,
    getIsUserNameSameAsEmail,
    (email, firstName, subscriptionId, securityQuestions, isUserNameSameAsEmail) => ({
        account: { email, useEmailAsUserName: isUserNameSameAsEmail, firstName, hasUserCredentials: false, hasExistingAccount: false, subscriptionId },
        securityQuestions,
    })
);

export const getConfirmationData = createSelector(
    getQuote,
    getIsClosedRadio,
    getIsEligibleForRegistration,
    getRegisterData,
    getSelectedSubscriptionIDForSAL,
    (quotes, isClosedRadio, isEligibleForRegistration, registerData, selectedSubscriptionIDForSAL) => {
        return { quotes, isClosedRadio, isEligibleForRegistration, registerData, selectedSubscriptionIDForSAL };
    }
);
