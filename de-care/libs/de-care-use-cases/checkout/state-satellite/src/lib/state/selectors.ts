import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutSatelliteState, featureKey } from './reducer';
import {
    getPaymentInfo,
    getPaymentInfoServiceAddress,
    getSelectedOffer,
    getSelectedPlanCode,
    getTransactionIdForSession,
    getUseCardOnFile,
    selectInboundQueryParams,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getAccountSubscriptions, getClosedDevicesFromAccount } from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const featureState = createFeatureSelector<CheckoutSatelliteState>(featureKey);
export const getSelectedRadioId = createSelector(featureState, (state) => state.selectedRadioId);
export const getSelectedRadioIdLastFour = createSelector(featureState, (state) => state.selectedRadioId?.substr(-4, 4));
export const getSelectedSubscriptionId = createSelector(featureState, (state) => state.selectedSubscriptionId);
export const getTransactionData = createSelector(featureState, (state) => state.transactionData);
export const getPromoCodeFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.promocode);
export const getDeviceInfo = createSelector(featureState, (state) => state?.deviceInfo);

export const getOrganicPurchaseDataHasBeenLoaded = createSelector(getSelectedOffer, (selectedOffer) => !!selectedOffer);
export const getTargetedPurchaseDataHasBeenLoaded = createSelector(getSelectedOffer, (selectedOffer) => !!selectedOffer);

// TODO: elevate this out to some shared lib for common JavaScript helpers
function getIntersectionOfSetsAsArray(arrayOneSet: Set<any>, arrayTwoSet: Set<any>): any[] {
    return [...arrayTwoSet].filter((x) => arrayOneSet.has(x));
}
// We only want to support the PHX query param of programcode.
//  This queryParamKeysNotAllowed and selector handle the following logic requirements:
//      * no upsell PHX app specific query param keys should be in the URL
const queryParamKeysNotAllowed = new Set(['upcode', 'promocode']);
export const getAllowedQueryParamsExist = createSelector(selectInboundQueryParams, (queryParams) => {
    if (!queryParams) {
        return false;
    }
    const invalidParamKeys = getIntersectionOfSetsAsArray(queryParamKeysNotAllowed, new Set(Object.keys(queryParams)));
    return invalidParamKeys.length === 0;
});

export const getAccountRequestData = createSelector(selectInboundQueryParams, ({ token, tkn, atok, act: accountNumber, radioid: radioId, lname: lastName, dtok }) => ({
    token: token || tkn || dtok || atok,
    tokenType: token || tkn || dtok ? 'SALES_AUDIO' : atok ? 'ACCOUNT' : null,
    accountNumber: accountNumber?.replace(/[^0-9]/g, ''),
    radioId,
    lastName,
}));

export const getProgramCodeFromQueryParams = createSelector(selectInboundQueryParams, ({ programcode }) => {
    return programcode;
});
export const getOfferRequestData = createSelector(
    getProgramCodeFromQueryParams,
    getSelectedRadioId,
    getPromoCodeFromQueryParams,
    (programCode, radioId, marketingPromoCode) => ({
        programCode,
        radioId,
        ...(marketingPromoCode ? { marketingPromoCode } : {}),
    })
);
export const getOfferRequestDataForOrganic = createSelector(getProgramCodeFromQueryParams, getPromoCodeFromQueryParams, (programCode, marketingPromoCode) => ({
    programCode,
    ...(marketingPromoCode ? { marketingPromoCode } : {}),
}));

export const getQuoteRequestData = createSelector(
    getSelectedPlanCode,
    getPaymentInfoServiceAddress,
    getSelectedRadioId,
    getSelectedSubscriptionId,
    (planCode, serviceAddress, radioId, subscriptionId) => ({
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
        subscriptionId,
    })
);

export const getSelectedRadioIsClosed = createSelector(getSelectedRadioId, getClosedDevicesFromAccount, (radioId, closedDevices) =>
    closedDevices?.find((device) => device.last4DigitsOfRadioId === radioId.substr(-4, 4))
);

export const getPayloadForPurchaseTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getUseCardOnFile,
    getTransactionIdForSession,
    getSelectedRadioId,
    getSelectedSubscriptionId,
    (planCode, paymentInfo, useCardOnFile, transactionIdForSession, radioId, subscriptionId) => {
        return {
            radioId,
            subscriptionId,
            plans: [{ planCode }],
            followOnPlans: [],
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

export const getAccountSubscription = createSelector(getAccountSubscriptions, getSelectedSubscriptionId, (subscriptions, selectedSubscriptionId) =>
    subscriptions?.find((subscription) => subscription.id === selectedSubscriptionId)
);
export const getAccountSubscriptionFirstPlan = createSelector(getAccountSubscription, (subscription) => subscription?.plans?.[0]);
export const getAccountVehicleInfo = createSelector(getAccountSubscription, (subscription) => subscription?.radioService?.vehicleInfo || null);
export const getAccountSubscriptonFirstPlanEndDate = createSelector(getAccountSubscriptionFirstPlan, (plan) => plan?.endDate);
export const getAccountSubscriptionFirstPlanTermLength = createSelector(getAccountSubscriptionFirstPlan, (plan) => plan?.termLength);
export const getAccountIsTrial = createSelector(getAccountSubscriptionFirstPlan, (plan) => plan?.type === 'TRIAL');
export const getAccountSubscriptionHasActiveNonTrialSubscription = createSelector(
    getAccountSubscription,
    (subscription) =>
        subscription?.plans?.some((plan) => plan?.type.toUpperCase() !== 'TRIAL') || subscription?.followonPlans?.some((plan) => plan?.type.toUpperCase() !== 'TRIAL')
);

// TODO: See about moving this into the state-common so it can be shared between satellite and streaming
export const getSelectedChangedOffer = createSelector(getSelectedPlanCode, getAllOffersAsArray, (planCode, allOffers) =>
    allOffers.find((offer) => offer.planCode === planCode)
);

// TODO: See about moving all the below into the state-common so they can be shared between satellite and streaming
const getSelectedPackageName = createSelector(getSelectedChangedOffer, (offer) => offer?.packageName);
const getSelectedOfferPackageDescription = createSelector(
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedPackageName,
    (packageDescriptions, packageName) => packageDescriptions?.[packageName]
);
export const getSelectedOfferPlatformAndPlanName = createSelector(getSelectedOfferPackageDescription, (packageDescription) => packageDescription?.name);
export const getSelectedOfferChannelCount = createSelector(getSelectedOfferPackageDescription, (packageDescription) => packageDescription?.channels?.[0]?.count);
export const getSelectedOfferPriceAndTermInfo = createSelector(getSelectedChangedOffer, (offer) =>
    offer
        ? {
              termLength: offer?.termLength,
              pricePerMonth: offer?.pricePerMonth,
              price: offer?.price,
              retailPricePerMonth: offer?.retailPrice,
              msrpPrice: offer?.msrpPrice,
          }
        : null
);
