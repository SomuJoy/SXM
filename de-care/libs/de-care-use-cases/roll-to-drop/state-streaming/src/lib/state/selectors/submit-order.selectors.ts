import { createSelector } from '@ngrx/store';
import { getOfferData, getOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    getAccountInfo,
    getNewAccountResults,
    getOrderSummaryData,
    getServiceAddressForSubmission,
    selectPromoCode
} from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { maskEmail } from '@de-care/domains/account/state-account';

export const getSubmitTrialOnlyOrderData = createSelector(
    getOfferPlanCode,
    getAccountInfo,
    getServiceAddressForSubmission,
    selectPromoCode,
    (planCode, accountInfo, serviceAddress, promoCode) => ({
        plans: [{ planCode: planCode }],
        serviceAddress: {
            ...serviceAddress,
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            email: accountInfo.email,
            phone: accountInfo.phoneNumber
        },
        streamingInfo: {
            login: accountInfo.email,
            password: accountInfo.password,
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            emailAddress: accountInfo.email
        },
        ...(promoCode && { marketingPromoCode: promoCode })
    })
);

export const selectConfirmationData = createSelector(
    getOfferData,
    getOrderSummaryData,
    getAccountInfo,
    getSecurityQuestions,
    getNewAccountResults,
    (offersData, orderSummaryData, { email }, securityQuestions, { isOfferStreamingEligible, isEligibleForRegistration }) => {
        return {
            maskedUsername: maskEmail(email),
            offersData,
            securityQuestions,
            planIsTrial: true,
            quotes: orderSummaryData?.quotes,
            registerCompData: {
                email,
                isOfferStreamingEligible,
                useEmailAsUsername: true,
                hasExistingAccount: false,
                isEligibleForRegistration,
                hasUserCredentials: true
            }
        };
    }
);
