import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode, getOfferData, getOfferPlanCode, getRenewalOffersFirstOffer, getRenewalOffersFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { getQuote, QuoteRequestAddressModel } from '@de-care/domains/quotes/state-quote';
import { featureKey, RollToDropTrialActivationSharedState } from '../state/reducer';
import { RTDAddress } from '../models/payment-info-models';
import { getProvince, getIsCanadaMode, getCountry, getSelectedProvince } from '@de-care/domains/customer/state-locale';

const selectFeature = createFeatureSelector<RollToDropTrialActivationSharedState>(featureKey);

export const getOfferDataWithStreaming = createSelector(getOfferData, (offerData) => ({
    offer: offerData.offer,
    offerDetails: { ...offerData.offerDetails, isStreaming: true },
}));

export const getFollowOnData = createSelector(selectFeature, getRenewalOffersFirstOffer, (state, offerRenewalData) =>
    state?.showFollowOnSelection
        ? {
              packageName: offerRenewalData?.packageName || null,
              pricePerMonth: offerRenewalData?.retailPrice || null,
          }
        : null
);

export const getOfferNotAvailableReason = createSelector(selectFeature, (state) => state.offerNotAvailableReason);

export const selectPromoCode = createSelector(selectFeature, (state) => state.promoCode);
export const selectProgramCode = createSelector(selectFeature, (state) => state.programCode);

export const getPromoCodeAndProgramCode = createSelector(selectPromoCode, selectProgramCode, (promoCode, programCode) => ({
    promoCode,
    programCode,
}));

export const getLangPref = createSelector(selectFeature, (state) => state.langPref);

export const getPaymentInfo = createSelector(selectFeature, (state) => state.paymentInfo);
export const getAccountInfo = createSelector(selectFeature, (state) => state.accountInfo);
export const getBillingAddress = createSelector(getPaymentInfo, (paymentInfo) => paymentInfo?.billingAddress || null);
export const getServiceAddress = createSelector(getAccountInfo, (accountInfo) => accountInfo?.serviceAddress || null);

export const getYourInfoDataLoadIsProcessing = createSelector(selectFeature, (state) => state.loadYourInfoDataIsProcessing);

export const getEligiblityCheckRequestData = createSelector(
    getFirstOfferPlanCode,
    getAccountInfo,
    getServiceAddress,
    getPaymentInfo,
    (planCode, accountInfo, serviceAddress, paymentInfo) => ({
        planCode,
        firstName: accountInfo?.firstName,
        lastName: accountInfo?.lastName,
        email: accountInfo?.email,
        ...(serviceAddress?.zip && { zipCode: serviceAddress?.zip }),
        ...(paymentInfo?.ccNum && { creditCardNumber: paymentInfo?.ccNum }),
    })
);

export const getBillingAddressForSubmission = createSelector(getBillingAddress, ({ addressLine1, zip, ...addressPartial }) => ({
    ...addressPartial,
    streetAddress: addressLine1,
    postalCode: zip,
    avsvalidated: false, // todo: use state data for this value
    addressType: 'person',
}));

export const getServiceAddressForSubmission = createSelector(getServiceAddress, ({ addressLine1, zip, ...addressPartial }) => ({
    ...addressPartial,
    streetAddress: addressLine1,
    postalCode: zip,
    avsvalidated: false, // todo: use state data for this value
    addressType: 'person',
}));

export const getSubmitTrialWithFollowOnOrderData = createSelector(
    getOfferPlanCode,
    getRenewalOffersFirstOfferPlanCode,
    getAccountInfo,
    getPaymentInfo,
    getBillingAddressForSubmission,
    getServiceAddressForSubmission,
    selectPromoCode,
    (planCode, renewalPlanCode, accountInfo, paymentInfo, billingAddress, serviceAddress, promoCode) => ({
        plans: [{ planCode: planCode }],
        followOnPlans: [{ planCode: renewalPlanCode }],
        billingAddress: {
            ...billingAddress,
            firstName: accountInfo?.firstName,
            lastName: accountInfo?.lastName,
            email: accountInfo?.email,
            phone: accountInfo?.phoneNumber,
        },
        serviceAddress: {
            ...serviceAddress,
            firstName: accountInfo?.firstName,
            lastName: accountInfo?.lastName,
            email: accountInfo?.email,
            phone: accountInfo?.phoneNumber,
        },
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
        streamingInfo: {
            login: accountInfo?.email,
            password: accountInfo?.password,
            firstName: accountInfo?.firstName,
            lastName: accountInfo?.lastName,
            emailAddress: accountInfo?.email,
        },
        ...(promoCode && { marketingPromoCode: promoCode }),
    })
);

function toQuoteRequestAddressModel(rtdAddress: RTDAddress): QuoteRequestAddressModel {
    return {
        streetAddress: rtdAddress.addressLine1,
        city: rtdAddress.city,
        state: rtdAddress.state,
        postalCode: rtdAddress.zip,
        country: rtdAddress.country,
    };
}

export const getRequestDataForQuoteQuery = createSelector(getOfferPlanCode, getAccountInfo, getRenewalOffersFirstOfferPlanCode, (planCode, accountInfo, renewalPlanCode) => ({
    planCode,
    serviceAddress: toQuoteRequestAddressModel(accountInfo.serviceAddress),
    renewalPlanCode,
}));

export const getOrderSummaryData = createSelector(getQuote, (quotes) => {
    return quotes ? { quotes } : null;
});

export const getShowFollowOnSelection = createSelector(selectFeature, (state) => state?.showFollowOnSelection);

export const getNewAccountResults = createSelector(selectFeature, (state) => state.newAccountResults);

export const getSubscriptionIdForNewAccount = createSelector(getNewAccountResults, (accResults) => accResults?.subscriptionId);

export const getDisplayNucaptcha = createSelector(selectFeature, (state) => state.displayNucaptcha);

export const getMaskedEmail = createSelector(selectFeature, (state) => state?.maskedEmail);

export { getOfferPlanCode };

export { getCountry };
export const getCanadaProvince = createSelector(getProvince, getIsCanadaMode, (province, isCanada) => (isCanada ? province : null));

export const getProvinceCode = createSelector(getSelectedProvince, (provinceCode) => provinceCode);

export const getProvinceCodeIfCanadaMode = createSelector(getSelectedProvince, getIsCanadaMode, (provinceCode, isCanada) => (isCanada ? provinceCode : null));

export const getNewAccountEmail = createSelector(getNewAccountResults, (newAccount) => newAccount?.email);

export { getIsStudentOffer } from '@de-care/domains/offers/state-offers';
