import { getIsClosedRadio } from '@de-care/domains/account/state-account';
import { getAccountSessionInfo } from '@de-care/domains/account/state-session-data';
import { getProvinceKey, getSelectedProvince } from '@de-care/domains/customer/state-locale';
import {
    getFirstOfferIsStreaming,
    getFirstOfferPlanCode,
    getOfferDetails,
    getRenewalOffers,
    OffersCustomerRequest,
    getOfferType,
    OfferTypeEnum,
    getSelectedRenewalPackageName,
    getRenewalOffersAsArray,
    getAllOffersAsArray,
} from '@de-care/domains/offers/state-offers';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { createSelector } from '@ngrx/store';
import { CreateAccountError } from './models';
import { selectRtpSharedFeature } from './reducer';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';

export { getSelectedRenewalPackageName } from '@de-care/domains/offers/state-offers';

export const getIsCreateAccountStepComplete = createSelector(selectRtpSharedFeature, (state) => state.isCreateAccountStepComplete);
export const getCreateAccountFormData = createSelector(selectRtpSharedFeature, (state) => state.createAccountFormData);
export const getBillingAddress = createSelector(getCreateAccountFormData, getIsCanadaMode, (state, isCanada) => {
    return {
        streetAddress: state?.paymentInfo?.address || '',
        city: state?.paymentInfo?.city || '',
        state: state?.paymentInfo?.state || '',
        postalCode: state?.paymentInfo?.zip || '',
        country: isCanada ? 'ca' : 'us',
    };
});
export const getServiceAddressSame = createSelector(getCreateAccountFormData, (state) => state?.paymentInfo.serviceAddressSame || false);

export const getServiceAddress = createSelector(
    getCreateAccountFormData,
    getBillingAddress,
    getIsCanadaMode,
    getServiceAddressSame,
    (formData, billingAddress, isCanada, serviceAddressSame) => {
        if (serviceAddressSame) {
            return billingAddress || null;
        }
        return formData?.correctedAddress?.streetAddress
            ? {
                  ...{
                      streetAddress: formData?.correctedAddress?.address,
                      city: formData?.correctedAddress?.city,
                      state: formData?.correctedAddress?.state,
                      postalCode: formData?.correctedAddress?.zip,
                  },
                  country: isCanada ? 'ca' : 'us',
              }
            : {
                  ...{
                      streetAddress: formData?.serviceAddress?.address,
                      city: formData?.serviceAddress?.city,
                      state: formData?.serviceAddress?.state,
                      postalCode: formData?.serviceAddress?.zip,
                  },
                  country: isCanada ? 'ca' : 'us',
              };
    }
);

export const getQueryParams = createSelector(selectRtpSharedFeature, (state) => state.queryParams);
export const getTransactionId = createSelector(selectRtpSharedFeature, (state) => state.transactionId);
export const getLast4digitsOfRadioId = createSelector(getQueryParams, (state) => state.last4digitsOfRadioId || '');
export const getRadioIdAndTransactionId = createSelector(getLast4digitsOfRadioId, getTransactionId, (radioId, transactionId) => {
    return {
        radioId,
        transactionId,
    };
});
export const getProgramCode = createSelector(getQueryParams, (state) => state.programCode);
export const getUsedCarBrandingType = createSelector(getQueryParams, (state) => state.usedCarBrandingType);
export const getRedirectURL = createSelector(getQueryParams, (state) => state.redirectURL);

export const getCreateAccountShouldShowError = createSelector(
    selectRtpSharedFeature,
    (state) => state.createAccountFormData && state.createAccountSubmissionHasError && !!state.createAccountError
);

export const getCreditCardErrorFound = createSelector(selectRtpSharedFeature, (state) => state.createAccountError === CreateAccountError.creditCard);

const getFirstAndLastName = createSelector(getAccountSessionInfo, ({ firstName, lastName }) => ({ firstName: firstName ?? '', lastName: lastName ?? '' }));

export const getSelectedRenewalPlanCode = createSelector(getSelectedRenewalPackageName, getRenewalOffers, (renewalPackageName, renewalOffers) => {
    const availableInfo = !!renewalPackageName && !!renewalOffers && Array.isArray(renewalOffers) && renewalOffers?.length > 0;
    return availableInfo ? renewalOffers?.filter((offer) => offer.packageName === renewalPackageName).map((offer) => offer.planCode)[0] : null;
});

export const getSelectedRenewalPlanCodeAndPrice = createSelector(getSelectedRenewalPackageName, getRenewalOffers, (renewalPackageName, renewalOffers) => {
    const availableInfo = !!renewalPackageName && !!renewalOffers && Array.isArray(renewalOffers) && renewalOffers?.length > 0;
    if (!!availableInfo) {
        return renewalOffers
            ?.filter((offer) => offer.packageName === renewalPackageName)
            .map((offer) => {
                return { price: offer.price, planCode: offer.planCode };
            })[0];
    }
    return null;
});

export const getOfferTypeIsTrialExtRtc = createSelector(getOfferType, (offerType) => offerType === OfferTypeEnum.TrialExtensionRTC);
export const getHasMultipleOffersOrRenewalOffers = createSelector(getAllOffersAsArray, getRenewalOffersAsArray, (offers, renewalOffers) => ({
    hasMultipleOffers: offers.length > 1,
    hasMultipleRenewalOffers: renewalOffers.length > 1,
}));

export const getHasMultipleOffers = createSelector(getAllOffersAsArray, (offers) => offers.length > 1);

export const getSelectedOfferPlanCode = createSelector(selectRtpSharedFeature, getHasMultipleOffers, (state, hasMultipleOffers) =>
    hasMultipleOffers && !state.selectedLeadOfferPlanCode ? 'multiple_offers_generic_offer_details' : state.selectedLeadOfferPlanCode
);

export const getCreateAccountFormDataForSubmission = createSelector(
    getRadioIdAndTransactionId,
    getCreateAccountFormData,
    getSelectedOfferPlanCode,
    getBillingAddress,
    getServiceAddress,
    getFirstAndLastName,
    getSelectedRenewalPlanCode,
    getOfferTypeIsTrialExtRtc,
    (radioIdAndTransactionId, formData, planCodeFromSelector, billingAddress, serviceAddress, { firstName, lastName }, renewalPlanCode, isTrialExtRtc) => {
        if (!radioIdAndTransactionId.radioId || !formData) {
            return null;
        }

        const ccExp = formData.paymentInfo.ccExp?.split('/');
        if (ccExp?.length !== 2) {
            return null;
        }
        const planCode = planCodeFromSelector as string;

        return {
            radioId: radioIdAndTransactionId.radioId,
            plans: [{ planCode }],
            followOnPlans: isTrialExtRtc ? [{ planCode: renewalPlanCode }] : [],
            paymentInfo: {
                useCardOnfile: false, // This is a new account
                paymentType: 'creditCard',
                cardInfo: {
                    nameOnCard: formData.paymentInfo.ccName,
                    cardNumber: formData.paymentInfo.ccNum,
                    expiryMonth: +ccExp[0],
                    expiryYear: +ccExp[1],
                },
                transactionId: radioIdAndTransactionId.transactionId,
            },
            billingAddress: { ...billingAddress, firstName, lastName, email: formData.userInfo.email, phone: formData.userInfo.phoneNumber },
            serviceAddress: { ...serviceAddress, firstName, lastName, email: formData.userInfo.email, phone: formData.userInfo.phoneNumber },
        };
    }
);

export const getOrderQuoteData = createSelector(getQuote, getIsClosedRadio, (quote, isClosedRadio) => ({
    quote,
    isClosedRadio,
}));

const getTransactionResultsData = createSelector(selectRtpSharedFeature, (state) => ({ ...state.transactionResultsData }));
export const getAccountIsEligibleForRegistration = createSelector(getTransactionResultsData, (transactionResultsData) => transactionResultsData?.isEligibleForRegistration);
export const hasSuccessfulTransactionData = createSelector(getTransactionResultsData, (transactionResultsData) => !!transactionResultsData);

export const getCCNum = createSelector(selectRtpSharedFeature, (state) => state.createAccountFormData?.paymentInfo.ccNum);
export const getLoadNewAccountRequestData = createSelector(getTransactionResultsData, getPvtTime, ({ accountNumber, radioId }, pvtTime) => {
    return { accountNumber, radioId, pvtTime };
});

export const getOfferRenewalsRequestParams = createSelector(
    selectRtpSharedFeature,
    getProvinceKey,
    getFirstOfferPlanCode,
    getFirstOfferIsStreaming,
    (state, province, planCode, streaming) => ({
        radioId: state?.queryParams?.last4digitsOfRadioId,
        planCode: planCode || '',
        streaming,
        province,
    })
);

export const getOfferDetailsInfo = createSelector(getRenewalOffers, getIsCanadaMode, getOfferDetails, (renewalOffers, isCanadaMode, offerDetails) => {
    return {
        ...offerDetails,
        msrpPrice:
            isCanadaMode && renewalOffers && renewalOffers[0] && renewalOffers[0]?.msrpPrice && offerDetails?.msrpPrice ? renewalOffers[0].msrpPrice : offerDetails?.msrpPrice,
    };
});

export const getIsMcp = createSelector(selectRtpSharedFeature, (state) => state.isMCPFlow);
export const getIsExtRtc = createSelector(selectRtpSharedFeature, (state) => state.isExtRtcFlow);

export const getSelectedRenewalPackageIsChoice = createSelector(getSelectedRenewalPackageName, (packageName) => !!packageName && packageName.search('CHOICE') !== -1);

export const getTotalNumberOfSteps = createSelector(getHasMultipleOffersOrRenewalOffers, ({ hasMultipleOffers, hasMultipleRenewalOffers }) =>
    hasMultipleOffers || hasMultipleRenewalOffers ? 4 : 3
);

export const getDefaultRenewalPlanCode = createSelector(getRenewalOffers, (renewalOffers) =>
    renewalOffers && Array.isArray(renewalOffers) && renewalOffers.length > 0 ? renewalOffers[0].planCode : null
);

export const getRenewalPlanCodeForQuote = createSelector(
    getSelectedRenewalPlanCode,
    getDefaultRenewalPlanCode,
    (selectedRenewalPlanCode, defaultPlanCode) => selectedRenewalPlanCode || defaultPlanCode
);

export const getOffersCustomerRequest = createSelector(
    getQueryParams,
    getSelectedProvince,
    ({ last4digitsOfRadioId: radioId, usedCarBrandingType, programCode }, province) =>
        ({
            streaming: false,
            student: false,
            usedCarBrandingType,
            radioId,
            programCode,
            province,
        } as OffersCustomerRequest)
);

export const getPlanCodeFromSelectedOffer = createSelector(getAllOffersAsArray, getSelectedOfferPlanCode, (offers, selectedPlanCode) =>
    !!selectedPlanCode ? offers.find((o) => o.planCode === selectedPlanCode)?.planCode : offers[0]?.planCode
);

export const getSelectedPickAPlanPlanCodeAndPrice = createSelector(getSelectedOfferPlanCode, getAllOffersAsArray, (selectedPlanCode, offers) => {
    const availableInfo = !!selectedPlanCode && !!offers && Array.isArray(offers) && offers?.length > 0;
    if (!!availableInfo) {
        return offers
            ?.filter((offer) => offer.planCode === selectedPlanCode)
            .map((offer) => {
                return { price: offer.price, planCode: offer.planCode };
            })[0];
    }
    return null;
});

export const getDisplayNucaptcha = createSelector(selectRtpSharedFeature, (state) => state.displayNucaptcha);

export const getOfferInfoDetails = createSelector(getSelectedOfferPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return planCode && offersInfo[planCode];
});

export const getOfferInfoDetailsViewModel = createSelector(getOfferInfoDetails, (offerInfo) => offerInfo?.offerDetails);
