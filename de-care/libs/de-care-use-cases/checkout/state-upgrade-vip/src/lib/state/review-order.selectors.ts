import { createSelector } from '@ngrx/store';
import { getOffersDataForAllOffers } from '@de-care/domains/offers/state-offers';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getFirstAccountSubscriptionId, getPersonalInfoSummary } from '@de-care/domains/account/state-account';
import {
    featureState,
    getFirstDevice,
    getSecondDevice,
    getSelectedPlanCode,
    getPaymentInfo,
    getSecondDeviceRadioIdLast4Digits,
    selectedPaymentMethod,
    getFirstDeviceStatus,
    getAccountRadioInfoLast4,
    getFirstRadioIsTrial,
    getFirstRadioIsClosed,
    getSecondDeviceInfo,
} from './selectors';

export const getReviewDataForWorkflow = createSelector(
    getFirstAccountSubscriptionId,
    getSelectedPlanCode,
    getAccountRadioInfoLast4,
    getSecondDeviceRadioIdLast4Digits,
    getFirstRadioIsTrial,
    (subscriptionId, planCode, firstRadioLast4, secondRadioLast4, firstRadioIsInTrial) => ({
        ...(!firstRadioIsInTrial && subscriptionId && { subscriptionId }),
        radioId: firstRadioIsInTrial && secondRadioLast4 ? secondRadioLast4 : firstRadioLast4,
        planCodes: [planCode],
    })
);

export const getReviewDataLoadIsProcessing = createSelector(featureState, (state) => state.loadReviewOrderDataIsProcessing);

export const getCompleteOrderStatusIsProcesssing = createSelector(featureState, (state) => state.completeOrderStatusIsProcesssing || state.captchaValidationProcessing);

export const getOrderSummaryData = createSelector(getQuote, getOffersDataForAllOffers, (quotes, offersData) => (quotes ? { quotes, offersData } : null));

export const getOrderSummaryExtraData = createSelector(getSecondDevice, (secondDevice) => ({
    isBothRadios: !!secondDevice,
    isPlatinumVIP: true,
}));

export const getReviewOrderHeaderViewModelData = createSelector(
    getFirstDevice,
    getSecondDevice,
    getFirstRadioIsTrial,
    getFirstRadioIsClosed,
    (firstDevice, secondDevice, firstRadioIsTrial, firstRadioIsClosed) => ({
        firstRadioIsTrial,
        firstRadioIsClosed,
        bothRadiosHaveSameStatus: secondDevice && firstRadioIsClosed,
        firstDevice,
        secondDevice,
    })
);

export const getCustomerAddress = createSelector(getPersonalInfoSummary, getPaymentInfo, (customerInfo, paymentInfo) => ({
    phone: customerInfo?.phone,
    avsvalidated: false,
    streetAddress: paymentInfo?.billingAddress?.addressLine1,
    city: paymentInfo?.billingAddress?.city,
    state: paymentInfo?.billingAddress?.state,
    postalCode: paymentInfo?.billingAddress?.zip,
    country: customerInfo?.country,
    firstName: customerInfo?.firstName,
    lastName: customerInfo?.lastName,
    email: customerInfo?.email,
}));

const getCustomerNewCardOptionTransactionRequestData = (
    paymentInfo,
    customerAddress,
    id,
    plans,
    radioIsTrial,
    firstRadioIsTrial,
    secondRadioPresent,
    isFirstDeviceRequest
) => {
    let emailAddressChanged = false;
    const serviceAddress = { ...customerAddress };
    if (paymentInfo && paymentInfo.email) {
        if ((isFirstDeviceRequest && (!firstRadioIsTrial || !secondRadioPresent)) || (!isFirstDeviceRequest && secondRadioPresent && firstRadioIsTrial)) {
            emailAddressChanged = true;
            serviceAddress.email = paymentInfo.email;
            serviceAddress.avsvalidated = true;
        }
    }
    return {
        ...id,
        ...(radioIsTrial ? { followOnPlans: plans } : { plans }),
        paymentInfo: {
            useCardOnfile: false,
            paymentType: 'creditCard',
            cardInfo: {
                cardNumber: parseInt(paymentInfo?.ccNum, 10),
                expiryMonth: paymentInfo?.ccExpDate?.split('/')[0],
                expiryYear: parseInt(paymentInfo?.ccExpDate?.split('/')[1], 10),
                nameOnCard: paymentInfo?.ccName,
            },
        },
        emailAddressChanged,
        billingAddress: customerAddress,
        serviceAddress,
    };
};

const getCustomerCardOnFileOptionTransactionRequestData = (id, plans, secondRadioIdAvailable, paymentInfo, radioIsTrial = false, secondDeviceInfo) => {
    let emailAddressChanged = false;
    let serviceAddress;
    let streamingInfo;
    const personalInfoSummary = secondDeviceInfo?.personalInfoSummary;
    const selectedStreamingAccount = secondDeviceInfo?.selectedStreamingAccount;
    if (paymentInfo && paymentInfo.email && !secondRadioIdAvailable) {
        emailAddressChanged = true;
        serviceAddress = { email: paymentInfo.email, avsvalidated: true };
    }
    if (secondRadioIdAvailable && personalInfoSummary) {
        streamingInfo = {
            firstName: personalInfoSummary.firstName ? personalInfoSummary.firstName : null,
            lastName: personalInfoSummary.lastName ? personalInfoSummary.lastName : null,
        };
    }
    if (selectedStreamingAccount?.password) {
        streamingInfo = {
            firstName: personalInfoSummary.firstName ? personalInfoSummary.firstName : null,
            lastName: personalInfoSummary.lastName ? personalInfoSummary.lastName : null,
            emailAddress: selectedStreamingAccount.userName ? selectedStreamingAccount.userName : null,
            login: selectedStreamingAccount.userName ? selectedStreamingAccount.userName : null,
            password: selectedStreamingAccount.password ? selectedStreamingAccount.password : null,
        };
    }
    return {
        ...id,
        ...(radioIsTrial ? { followOnPlans: plans } : { plans }),
        emailAddressChanged,
        paymentInfo: {
            useCardOnfile: true,
        },
        serviceAddress,
        streamingInfo: streamingInfo,
    };
};

export const purchaseTransactionRequestData = createSelector(
    selectedPaymentMethod,
    getSelectedPlanCode,
    getFirstAccountSubscriptionId,
    getAccountRadioInfoLast4,
    getSecondDeviceInfo,
    getPaymentInfo,
    getCustomerAddress,
    getFirstRadioIsTrial,
    (paymentMethodType, planCode, subscriptionId, firstRadioId, secondDeviceInfo, paymentInfo, customerAddress, firstRadioIstrial) => {
        const plans = [{ planCode }];
        const streamingPlanCode = secondDeviceInfo.streamingVipPlanCode;
        const isSecondSubscriptionStreaming = secondDeviceInfo.selectedStreamingAccount;
        const secondDevicePlan = isSecondSubscriptionStreaming ? [{ planCode: streamingPlanCode }] : [{ planCode }];
        const firstDeviceId = subscriptionId ? { subscriptionId } : { radioId: firstRadioId };
        const secondSubscriptionId = secondDeviceInfo?.secondDeviceSubscriptionId;
        const secondRadioId = secondDeviceInfo?.secondDeviceRadioIdLast4Digits;
        const secondDeviceId = secondSubscriptionId ? { subscriptionId: secondSubscriptionId } : { radioId: secondRadioId };
        const hasValidSecondDevice = isSecondSubscriptionStreaming || secondRadioId;
        switch (paymentMethodType) {
            case 'newCard':
                return {
                    firstDeviceRequest: getCustomerNewCardOptionTransactionRequestData(
                        paymentInfo,
                        customerAddress,
                        firstDeviceId,
                        plans,
                        firstRadioIstrial,
                        firstRadioIstrial,
                        !!secondRadioId,
                        true
                    ),
                    secondDeviceRequest: hasValidSecondDevice
                        ? getCustomerNewCardOptionTransactionRequestData(paymentInfo, customerAddress, secondDeviceId, secondDevicePlan, false, firstRadioIstrial, true, false)
                        : null,
                };
            default:
                return {
                    firstDeviceRequest: getCustomerCardOnFileOptionTransactionRequestData(firstDeviceId, plans, !!secondRadioId, paymentInfo, firstRadioIstrial, null),
                    secondDeviceRequest: hasValidSecondDevice
                        ? getCustomerCardOnFileOptionTransactionRequestData(secondDeviceId, secondDevicePlan, true, paymentInfo, false, secondDeviceInfo)
                        : null,
                };
        }
    }
);
export const purchaseTransactionRequestDataExists = createSelector(
    purchaseTransactionRequestData,
    getFirstDeviceStatus,
    (transactionRequestData, firstDeviceStatus) =>
        (transactionRequestData?.firstDeviceRequest?.subscriptionId || transactionRequestData?.firstDeviceRequest?.radioId) && firstDeviceStatus
);

export const getCaptchaValidationIsProcessing = createSelector(featureState, (state) => state.captchaValidationProcessing);
