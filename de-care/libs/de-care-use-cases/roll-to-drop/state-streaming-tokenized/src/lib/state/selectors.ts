import { getFirstOfferPlanCode, getOfferData, getOfferPlanCode, getRenewalOffersFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RollToDropTrialActivationTokenizedState, featureKey } from './reducer';
import {
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import {
    getAccountInfo,
    getLangPref,
    getNewAccountResults,
    getOfferNotAvailableReason,
    getOrderSummaryData,
    getServiceAddressForSubmission,
    selectPromoCode,
    getBillingAddressForSubmission,
    getPaymentInfo,
    getNewAccountEmail,
} from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { maskEmail } from '@de-care/domains/account/state-account';

export const selectFeature = createFeatureSelector<RollToDropTrialActivationTokenizedState>(featureKey);

export const getFollowOnOptionSelected = createSelector(selectFeature, (state) => state.followOnOptionSelected);

export const getSubmitOrderIsProcessing = createSelector(selectFeature, (state) => state.submitOrderIsProcessing);

const getSalesHeroData = createSelector(getFirstOfferPlanCode, selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, (planCode, salesHero) => salesHero[planCode] || null);

export const getSalesHeroCopyVM = createSelector(getSalesHeroData, (salesHeroData) => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            // TODO: get themes and turn these into classes that can be applied to the hero component
            //       not sure how this will work, but setting this as larger-padding for now
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});

export const getOfferDescriptionVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescriptions) => offerDescriptions[planCode] || null
);

export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);

export const rollToDropStreamingTokenizedVM = createSelector(
    getSalesHeroCopyVM,
    getOfferDescriptionVM,
    getLegalCopyData,
    (salesHeroData, offerDescriptionData, legalCopyData) => ({
        salesHeroData,
        offerDescriptionData,
        legalCopyData,
    })
);

export const getLangPrefAndOfferNotAvailableReason = createSelector(getLangPref, getOfferNotAvailableReason, (langPref, offerNotAvailableReason) => ({
    langPref,
    offerNotAvailableReason,
}));

export const getTokenAddressIsValid = createSelector(selectFeature, (state) => state.hasValidAddress);
export const getMaskedUserNameFromToken = createSelector(selectFeature, (state) => state.maskedUserName || null);

export const selectConfirmationData = createSelector(
    getOfferData,
    getOrderSummaryData,
    getNewAccountEmail,
    getSecurityQuestions,
    getNewAccountResults,
    (offersData, orderSummaryData, email, securityQuestions, { isOfferStreamingEligible, isEligibleForRegistration }) => {
        return {
            offersData,
            securityQuestions,
            planIsTrial: true,
            quotes: orderSummaryData?.quotes ?? {},
            registerCompData: {
                email,
                isOfferStreamingEligible,
                useEmailAsUsername: true,
                hasExistingAccount: false,
                isEligibleForRegistration,
                hasUserCredentials: true,
            },
        };
    }
);

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
            phone: accountInfo.phoneNumber,
        },
        streamingInfo: {
            login: accountInfo.email,
            password: accountInfo.password,
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            emailAddress: accountInfo.email,
        },
        ...(promoCode && { marketingPromoCode: promoCode }),
    })
);

export const getSubmitRequestWithoutServiceAddress = createSelector(getOfferPlanCode, selectPromoCode, (planCode, promoCode) => ({
    plans: [{ planCode: planCode }],
    ...(promoCode && { marketingPromoCode: promoCode }),
}));

export const getRequestDataForQuoteWithoutServiceAddress = createSelector(getOfferPlanCode, getRenewalOffersFirstOfferPlanCode, (planCode, renewalPlanCode) => ({
    planCode,
    renewalPlanCode,
}));

export const getSubmitTrialWithFollowOnOrderDataWitoutServiceAddress = createSelector(
    getOfferPlanCode,
    getRenewalOffersFirstOfferPlanCode,
    getPaymentInfo,
    getBillingAddressForSubmission,
    selectPromoCode,
    (planCode, renewalPlanCode, paymentInfo, billingAddress, promoCode) => ({
        plans: [{ planCode: planCode }],
        followOnPlans: [{ planCode: renewalPlanCode }],
        ...(billingAddress.streetAddress && { billingAddress }),
        ...(paymentInfo?.ccNum && {
            paymentInfo: {
                useCardOnfile: false,
                paymentType: 'creditCard',
                cardInfo: {
                    nameOnCard: paymentInfo?.ccName,
                    cardNumber: +paymentInfo?.ccNum,
                    expiryMonth: +paymentInfo?.ccExpDate.split('/')[0],
                    expiryYear: +paymentInfo?.ccExpDate.split('/')[1],
                    securityCode: paymentInfo?.securityCode,
                },
                transactionId: paymentInfo?.transactionId,
            },
        }),
        ...(promoCode && { marketingPromoCode: promoCode }),
    })
);
