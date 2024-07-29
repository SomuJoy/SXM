import {
    getCustomerInfo,
    getPaymentInfo,
    selectInboundQueryParams,
    getUserEnteredCredentials,
    getSelectedPlanCode,
    getPaymentInfoServiceAddress,
    getUseCardOnFile,
    getTransactionIdForSession,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getAccountHasClosedDevices, selectAccount } from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getClosedOrInactiveRadioDevicesAsArray } from '@de-care/domains/identity/state-flepz-lookup';
import {
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import { getRenewalQuoteDetailAsArray } from '@de-care/domains/quotes/state-quote';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutSatelliteChangeToState, featureKey } from './reducer';

export const featureState = createFeatureSelector<CheckoutSatelliteChangeToState>(featureKey);
export const getTransactionData = createSelector(featureState, (state) => state.transactionData);
export const getSelectedRadioId = createSelector(featureState, (state) => state.selectedRadioId);
export const getSelectedSubscriptionId = createSelector(featureState, (state) => state.selectedSubscriptionId);
export const getSubscriptionIdToChangeFrom = createSelector(featureState, (state) => state.subscriptionIdToChangeFrom);
export const getSelectedUpsellPlanCode = createSelector(featureState, (state) => state.selectedUpsellPlanCode);

export const getSelectedUpsellOfferLegalCopy = createSelector(
    getSelectedUpsellPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, offerInfoLegalCopy) => offerInfoLegalCopy?.[planCode]
);
const getSelectedUpsellOfferPlanRecapData = createSelector(
    getSelectedUpsellPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerInfoOfferDescription) => {
        const description = offerInfoOfferDescription?.[planCode];
        return {
            description: description?.recapDescription,
            longDescription: description?.recapLongDescription,
        };
    }
);
export const getSelectedUpsellOfferPlanRecapViewModel = createSelector(getSelectedUpsellOfferPlanRecapData, ({ description }) => {
    return { description };
});
export const getSelectedUpsellOfferPlanRecapLongDescriptionViewModel = createSelector(getSelectedUpsellOfferPlanRecapData, ({ longDescription }) => {
    return { description: longDescription };
});

export const getProgramCodeFromQueryParams = createSelector(selectInboundQueryParams, ({ programcode }) => {
    return programcode;
});
export const getOfferWasLoaded = createSelector(getProgramCodeFromQueryParams, (programCode) => {
    return true;
});

export const getAccountRequestData = createSelector(getPaymentInfo, getCustomerInfo, getUserEnteredCredentials, (paymentInfo, customerInfo, userEnteredCredentials) => ({
    firstName: customerInfo?.firstName,
    lastName: customerInfo?.lastName,
    email: userEnteredCredentials?.email,
    phoneNumber: customerInfo?.phoneNumber,
    zipCode: paymentInfo?.serviceAddress?.zip,
}));

export const getPlanRecapAndLegalCopyView = createSelector(
    getSelectedUpsellOfferPlanRecapLongDescriptionViewModel,
    getSelectedUpsellOfferLegalCopy,
    (planRecap, legalCopy) => ({
        planRecap,
        legalCopy,
    })
);

export const getClosedDevicesFromAccount = createSelector(getAccountHasClosedDevices, selectAccount, (hasClosedDevices, account) =>
    hasClosedDevices ? account.closedDevices : null
);
export const getSelectedYMM = createSelector(
    getSelectedRadioId,
    getClosedOrInactiveRadioDevicesAsArray,
    getClosedDevicesFromAccount,
    (selectedRadioId, radioDevicesArray, closedDevicesFromAccount) => {
        const selectedRadioSubscription = radioDevicesArray.find((radios) => radios.radioService.last4DigitsOfRadioId === selectedRadioId);
        const selectedClosedSubscription = closedDevicesFromAccount.find((radios) => radios.last4DigitsOfRadioId === selectedRadioId);
        const vehicleInfo = selectedRadioSubscription ? selectedRadioSubscription.radioService.vehicleInfo : selectedClosedSubscription.vehicleInfo;
        const nickname = selectedRadioSubscription ? selectedRadioSubscription.nickname : selectedClosedSubscription.nickname;
        const hasDuplicateVehicleInfo = selectedRadioSubscription ? selectedRadioSubscription.hasDuplicateVehicleInfo : selectedClosedSubscription.hasDuplicateVehicleInfo;

        let yearMakeModel;
        let last4OfRadioId;
        if (!nickname) {
            yearMakeModel = vehicleInfo?.year || vehicleInfo?.make || vehicleInfo?.model ? vehicleInfo : null;
            if (!yearMakeModel || hasDuplicateVehicleInfo) {
                last4OfRadioId = selectedRadioId;
            }
        }
        const vehicleInfoVM = {
            ...(nickname && { nickname }),
            ...(yearMakeModel && { yearMakeModel }),
            ...(last4OfRadioId && { last4OfRadioId }),
        };

        return vehicleInfoVM;
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

export const getServiceAddressCollected = createSelector(getPaymentInfoServiceAddress, (serviceAddress) => {
    return !!serviceAddress?.addressLine1 && !!serviceAddress?.city && !!serviceAddress?.state && !!serviceAddress?.zip;
});

export const getPayloadForPurchaseTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getUseCardOnFile,
    getTransactionIdForSession,
    getSelectedRadioId,
    getSelectedSubscriptionId,
    getRenewalQuoteDetailAsArray,
    (planCode, paymentInfo, useCardOnFile, transactionIdForSession, radioId, subscriptionId, renewalQuotes) => {
        return {
            radioId,
            subscriptionId,
            plans: [{ planCode }],
            followOnPlans: renewalQuotes.map(({ planCode }) => ({ planCode })), // TODO: this should eventually get changed to a better solution so we are not using "quote" data for follow on plans
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

export const getUseSelectYourRadioUrlForDeviceEdit = createSelector(getClosedOrInactiveRadioDevicesAsArray, (closedOrInactiveRadioDevicesAsArray) =>
    closedOrInactiveRadioDevicesAsArray.length > 0 ? true : false
);
