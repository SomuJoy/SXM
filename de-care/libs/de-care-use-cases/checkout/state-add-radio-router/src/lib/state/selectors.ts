import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutAddRadioRouterState, featureKey } from './reducer';
import { selectAccount } from '@de-care/domains/account/state-account';
import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import {
    getPaymentInfo,
    getPaymentInfoServiceAddress,
    getSelectedPlanCode,
    getTransactionIdForSession,
    getUseCardOnFile,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';

export const featureState = createFeatureSelector<CheckoutAddRadioRouterState>(featureKey);

export const getSelectedRadioId = createSelector(featureState, (state) => state.selectedRadioId);

export const getDeviceInfo = createSelector(featureState, (state) => state?.deviceInfo);

export const getTransactionData = createSelector(featureState, (state) => state.transactionData);
export const getTransactionSubscriptionId = createSelector(getTransactionData, (transactionData) => transactionData?.subscriptionId);

export const getAccountRequestData = createSelector(selectAccount, (account) => ({
    firstName: account?.firstName,
    lastName: account?.lastName,
    email: account?.email,
    phoneNumber: account?.phone,
    zipCode: account?.serviceAddress?.postalCode,
}));

export const getOffersAddSelectionData = createSelector(getAllOffersAsArray, selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode, (offers, offerDescription) => {
    const mainOffers = offers?.slice(0, 3).map((offer) => {
        return {
            isBestPackage: offer.bestPackage,
            planCode: offer.planCode,
            data: {
                packageName: offerDescription[offer.planCode]?.platformPlan,
                highlightsText: offerDescription[offer.planCode]?.details,
                priceAndTermDescTitle: offerDescription[offer.planCode]?.priceAndTermDescTitle,
                processingFeeDisclaimer: offerDescription[offer.planCode]?.processingFeeDisclaimer,
                icons: offerDescription[offer.planCode]?.icons,
                footer: offerDescription[offer.planCode]?.footer,
                theme: offerDescription[offer.planCode]?.theme,
            },
        };
    });
    const additionalOffers = offers?.slice(3).map((offer) => {
        return {
            isBestPackage: offer.bestPackage,
            planCode: offer.planCode,
            data: {
                packageName: offerDescription[offer.planCode]?.platformPlan,
                highlightsText: offerDescription[offer.planCode]?.details,
                priceAndTermDescTitle: offerDescription[offer.planCode]?.priceAndTermDescTitle,
                processingFeeDisclaimer: offerDescription[offer.planCode]?.processingFeeDisclaimer,
                icons: offerDescription[offer.planCode]?.icons,
                footer: offerDescription[offer.planCode]?.footer,
                theme: offerDescription[offer.planCode]?.theme,
            },
        };
    });
    return {
        mainOffers,
        additionalOffers,
    };
});

const getSelectedOfferPlanRecapData = createSelector(
    getSelectedPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerInfoOfferDescription) => {
        const description = offerInfoOfferDescription?.[planCode];
        return {
            description: description?.recapDescription,
            longDescription: description?.recapLongDescription,
        };
    }
);

export const getSelectedOfferPlanRecapLongDescriptionViewModel = createSelector(getSelectedOfferPlanRecapData, ({ longDescription }) => {
    return { description: longDescription };
});

export const getSelectedUpsellOfferLegalCopy = createSelector(
    getSelectedPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, offerInfoLegalCopy) => offerInfoLegalCopy?.[planCode]
);
export const getPlanRecapAndLegalCopyView = createSelector(getSelectedOfferPlanRecapLongDescriptionViewModel, getSelectedUpsellOfferLegalCopy, (planRecap, legalCopy) => ({
    planRecap,
    legalCopy,
}));

export const getQuoteRequestData = createSelector(getSelectedPlanCode, getPaymentInfoServiceAddress, getSelectedRadioId, (planCode, serviceAddress, radioId) => ({
    planCodes: [planCode],
    ...(serviceAddress
        ? {
              serviceAddress: {
                  streetAddress: serviceAddress?.addressLine1,
                  city: serviceAddress?.city,
                  state: serviceAddress?.state,
                  postalCode: serviceAddress?.zip,
                  country: serviceAddress?.country,
              },
          }
        : {}),
    radioId,
}));

export const getRegistrationViewModel = createSelector(getSecurityQuestions, getTransactionData, (securityQuestions, transactionData) => {
    if (securityQuestions?.length > 0 && transactionData?.email) {
        return {
            securityQuestions,
            accountInfo: {
                email: transactionData.email,
                useEmailAsUsername: false,
                firstName: '',
                hasUserCredentials: false,
                hasExistingAccount: false,
                isOfferStreamingEligible: transactionData.isOfferStreamingEligible,
                isEligibleForRegistration: transactionData.isEligibleForRegistration,
                subscriptionId: transactionData.subscriptionId,
            },
        };
    } else {
        return null;
    }
});

export const getPayloadForPurchaseTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getUseCardOnFile,
    getTransactionIdForSession,
    getSelectedRadioId,
    selectFirstFollowOnOfferPlanCode,
    (planCode, paymentInfo, useCardOnFile, transactionIdForSession, radioId, followonPlancode) => {
        return {
            radioId,
            plans: [{ planCode }],
            followOnPlans: followonPlancode ? [{ planCode: followonPlancode }] : [],
            paymentInfo: {
                paymentType: 'creditCard',
                ...(useCardOnFile
                    ? { useCardOnfile: useCardOnFile }
                    : {
                          cardInfo: {
                              nameOnCard: paymentInfo?.nameOnCard,
                              cardNumber: +paymentInfo?.cardNumber,
                              expiryMonth: +paymentInfo?.cardExpirationDate?.split('/')?.[0],
                              expiryYear: +paymentInfo?.cardExpirationDate?.split('/')?.[1],
                              securityCode: paymentInfo?.cvv,
                          },
                      }),
                transactionId: transactionIdForSession,
                giftCards: paymentInfo?.giftCard ? [paymentInfo.giftCard] : [],
                paymentAmount: null,
            },
            ...(paymentInfo?.serviceAddress
                ? {
                      serviceAddress: {
                          streetAddress: paymentInfo?.serviceAddress?.addressLine1,
                          city: paymentInfo?.serviceAddress?.city,
                          state: paymentInfo?.serviceAddress?.state,
                          postalCode: paymentInfo?.serviceAddress?.zip,
                          country: paymentInfo?.serviceAddress?.country,
                          avsvalidated: paymentInfo?.serviceAddress?.avsValidated,
                          addressType: 'person',
                      },
                      billingAddress: {
                          streetAddress: paymentInfo?.serviceAddress?.addressLine1,
                          city: paymentInfo?.serviceAddress?.city,
                          state: paymentInfo?.serviceAddress?.state,
                          postalCode: paymentInfo?.serviceAddress?.zip,
                          country: paymentInfo?.serviceAddress?.country,
                          avsvalidated: paymentInfo?.serviceAddress?.avsValidated,
                          addressType: 'person',
                      },
                  }
                : {}),
        };
    }
);
