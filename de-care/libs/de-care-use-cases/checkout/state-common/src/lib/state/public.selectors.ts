import { createSelector } from '@ngrx/store';
import { featureState, getAllowLicensePlateLookup, getProgramcode, getSelectedPlanCode, getSelectedProvinceCode } from './selectors';
import {
    selectOfferInfoDealAddonForCurrentLocaleMappedByPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import { getAccountBillingSummary } from '@de-care/domains/account/state-account';
import { getAllOffersAsArray, getRenewalOffersFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { getNormalizedQueryParams, getRouteSegments } from '@de-care/shared/state-router-store';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import { getAllUpsellOffersAsArray } from '@de-care/domains/offers/state-upsells';

export { selectInboundQueryParams, getSelectedProvinceCode, getSelectedPlanCode } from './selectors';
export const getTransactionIdForSession = createSelector(featureState, (state) => state.transactionIdForSession);
export const getUserEnteredCredentials = createSelector(featureState, (state) => state.userEnteredCredentials);
export const getCustomerInfo = createSelector(featureState, (state) => state.customerInfo);
export const getPaymentInfo = createSelector(featureState, (state) => state.paymentInfo);
export const getPaymentInfoServiceAddress = createSelector(getPaymentInfo, (paymentInfo) => paymentInfo?.serviceAddress);
export const getPaymentInfoBillingAddress = createSelector(getPaymentInfo, (paymentInfo) => paymentInfo?.billingAddress);
export const getUseCardOnFile = createSelector(featureState, (state) => state.useCardOnFile);
export const getCardOnFile = createSelector(getAccountBillingSummary, (billingSummary) => billingSummary?.creditCard);
export const getPaymentMethodOptionsViewModel = createSelector(getCardOnFile, (cardOnFile) => ({
    useCardOnFileAllowed: cardOnFile?.status?.toUpperCase() === 'ACTIVE',
    ...(cardOnFile?.type ? { cardType: cardOnFile?.type } : {}),
    ...(cardOnFile?.last4Digits ? { cardNumberLastFour: cardOnFile?.last4Digits } : {}),
}));
export const getPaymentInfoCardNumberLastFourAndCardType = createSelector(getPaymentInfo, getUseCardOnFile, getCardOnFile, (paymentInfo, useCardOnFile, cardOnFile) => ({
    cardType: useCardOnFile ? cardOnFile?.type : paymentInfo?.cardType,
    cardNumberLastFour: useCardOnFile ? cardOnFile?.last4Digits : paymentInfo?.cardNumber?.toString()?.substr(-4, 4),
}));
export const getSelectedPaymentMethodSummaryViewModel = createSelector(getPaymentInfoCardNumberLastFourAndCardType, (cardNumberAndType) => ({
    ...cardNumberAndType,
    cardType: cardNumberAndType?.cardType?.toUpperCase(),
}));
export const getNuCaptchaRequired = createSelector(featureState, (state) => state.nuCaptchaRequired);
export const getShouldIncludeNuCaptcha = createSelector(getNuCaptchaRequired, (required) => required);
export const getSelectedOffer = createSelector(
    getSelectedPlanCode,
    getAllOffersAsArray,
    getAllUpsellOffersAsArray,
    (planCode, offers, upsellOffers) => offers?.find((offer) => offer.planCode === planCode) || upsellOffers?.find((offer) => offer.planCode === planCode)
);
export const getSelectedPackageName = createSelector(getSelectedOffer, (offer) => offer?.packageName);
export const getSelectedOfferOfferInfoHero = createSelector(getSelectedPlanCode, selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, (planCode, hero) =>
    planCode ? hero?.[planCode] : null
);
export const getSelectedOfferOfferInfoOfferDescription = createSelector(
    getSelectedPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescription) => (planCode ? offerDescription?.[planCode] : null)
);

export const getSelectedOfferOfferInfoLegalCopy = createSelector(selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode, getSelectedPlanCode, (offerDetails, planCode) =>
    planCode ? offerDetails?.[planCode] : null
);

export const getQuebecProvince = createSelector(getSelectedProvinceCode, (selectedProvinceCode) => {
    if (selectedProvinceCode?.toLowerCase() === 'qc') {
        return true;
    } else {
        return false;
    }
});

export const getFirstRenewalOfferInfoDescription = createSelector(
    getRenewalOffersFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescription) => (planCode ? offerDescription?.[planCode] : null)
);

export const getFirstRenewalOfferInfoLegalCopy = createSelector(
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    getRenewalOffersFirstOfferPlanCode,
    (offerDetails, planCode) => (planCode ? offerDetails?.[planCode] : null)
);

export const getAllowLicensePlateLookupFlag = createSelector(getAllowLicensePlateLookup, (plateLookup) => plateLookup);

export const getSelectedOfferDealCopy = createSelector(selectOfferInfoDealAddonForCurrentLocaleMappedByPlanCode, getSelectedPlanCode, (deals, planCode) =>
    planCode ? deals?.[planCode] : null
);

export const getAllOffers = createSelector(getAllOffersAsArray, (offers) => offers);

export const getCampaignIdFromQueryParams = createSelector(getNormalizedQueryParams, ({ utm_content }) => utm_content);
const getSelectedOfferPackageDescription = createSelector(
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedPackageName,
    (packageDescriptions, packageName) => packageDescriptions?.[packageName || '']
);
export const getSelectedOfferIsFallback = createSelector(getSelectedOffer, (offer) => offer?.fallback);

export const getSelectedOfferPlatformAndPlanName = createSelector(getSelectedOfferPackageDescription, (packageDescription) => packageDescription?.name);
export const getSelectedOfferChannelCount = createSelector(getSelectedOfferPackageDescription, (packageDescription) => packageDescription?.channels?.[0]?.count);
export const getSelectedOfferPriceAndTermInfo = createSelector(getSelectedOffer, (offer) =>
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
export const getSelectedOfferViewModel = createSelector(
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferPlatformAndPlanName,
    getSelectedOfferChannelCount,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferPriceAndTermInfo,
    getSelectedOfferIsFallback,
    getSelectedPlanCode,
    getSelectedOfferDealCopy,
    (offerDescription, platformAndPlanName, channelCount, legalCopy, priceAndTerm, isFallbackOffer, planCode, offerDealCopy) => ({
        offerDescription: {
            ...offerDescription,
            ...(planCode === 'Trial - Premier Streaming - 3mo - $0.00'
                ? {
                      processingFeeDisclaimer: offerDescription.processingFeeDisclaimer.replace('<br', ' <br>Cancel online anytime.<br'),
                      details: offerDescription.details.map((detail) => detail.replace('<br>', '. ').replace('<sub>', '').replace('</sub>', '')),
                  }
                : {}),
        },
        platformAndPlanName,
        channelCount,
        legalCopy,
        ...priceAndTerm,
        isFallbackOffer,
        offerDealCopy,
    })
);
export const getSelectedPlanDealType = createSelector(getSelectedOffer, (offer) => offer?.deal?.type);

export const getPlanRecapCardViewModel = createSelector(getSelectedOfferOfferInfoOfferDescription, (offerDescription) => {
    return offerDescription?.recapDescription
        ? {
              description: offerDescription?.recapDescription,
          }
        : null;
});

export const getLongDescriptionPlanRecapCardViewModel = createSelector(getSelectedOfferOfferInfoOfferDescription, (offerDescription) => {
    return offerDescription?.recapLongDescription
        ? {
              description: offerDescription?.recapLongDescription,
          }
        : null;
});

export const getIneligibleErrorViewModel = createSelector(getNormalizedQueryParams, getProgramcode, getRouteSegments, (queryParams, programcode, routeSegments) => ({
    errorCode: queryParams?.errorcode,
    programCode: programcode,
    routeSegments,
}));

export const getSelectedOfferFallbackReasonInfo = createSelector(getSelectedOffer, getProgramcode, (offer, programcode) => ({
    isFallback: !!offer?.fallback,
    reason: offer?.fallbackReason,
    programcode,
}));

export const getIsRefreshAllowed = createSelector(featureState, (state) => state.isRefreshAllowed);
