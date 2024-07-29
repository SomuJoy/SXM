import { createSelector } from '@ngrx/store';
import { getRenewalOffersAsArray, selectOffer } from '@de-care/domains/offers/state-offers';
import { isOfferMCP, PlanTypeEnum, OfferNotAvailableReasonEnum } from '@de-care/data-services';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

export const getContainsChoicePackages = createSelector(
    getRenewalOffersAsArray,
    renewalOffers => !!renewalOffers?.map(offer => offer?.parentPackageName).find(pkgName => pkgName?.includes('CHOICE'))
);

export const getRenewalOffersAsArrayModified = createSelector(getRenewalOffersAsArray, getContainsChoicePackages, (offersArray, containsChoice) => {
    const packagesToDisplay = 3;
    if (containsChoice) {
        return offersArray.slice(-packagesToDisplay);
    }
    return offersArray;
});

export const getRenewalOffersPackageNamesModified = createSelector(getRenewalOffersAsArrayModified, renewalOffers =>
    renewalOffers.map(p => p.parentPackageName || p.packageName)
);

export const getLandingPageInboundUrlParams = createSelector(getNormalizedQueryParams, ({ programcode: programCode, renewalcode: renewalCode }) => ({
    programCode,
    renewalCode
}));

export const getRtcOfferDetails = createSelector(
    selectOffer,
    getNormalizedQueryParams,
    getRenewalOffersAsArrayModified,
    (offer, { programcode: programCode }, renewalPackages) => ({
        leadOffer: offer,
        programCode,
        renewalPackages,
        offerDetails: getOfferDetails(offer)
    })
);

export const getPlanComparisonGridParams = createSelector(selectOffer, leadOffer => ({
    selectedPackageName: leadOffer.packageName,
    familyDiscount: null,
    leadOfferPackageName: leadOffer.packageName,
    leadOfferTerm: leadOffer.termLength,
    trialEndDate: null
}));

export const getFollowOnPlanSelectionData = createSelector(selectOffer, getRenewalOffersAsArrayModified, (leadOffer, renewalPackages) => ({
    packages: renewalPackages,
    selectedPackageName: leadOffer.packageName,
    leadOfferEndDate: leadOffer.planEndDate,
    leadOfferPackageName: leadOffer.packageName
}));

export const getRenewalPrices = createSelector(getRenewalOffersAsArrayModified, renewalOffers =>
    renewalOffers.map(offer => ({ pricePerMonth: offer.pricePerMonth, mrdEligible: offer.mrdEligible }))
);

// TODO: Do we need all this here???
function getOfferDetails(offer) {
    return {
        type: offer.deal ? offer.deal.type : getOfferType(offer.type),
        offerTotal: offer.price,
        processingFee: offer.processingFee,
        msrpPrice: offer.msrpPrice,
        name: offer.packageName,
        offerTerm: offer.termLength,
        offerMonthlyRate: offer.pricePerMonth,
        savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
        retailRate: offer.retailPrice,
        etf: offer.deal && offer.deal.etfAmount,
        etfTerm: offer.deal && offer.deal.etfTerm,
        priceChangeMessagingType: offer.priceChangeMessagingType,
        isStreaming: false,
        deal: offer.deal,
        isMCP: isOfferMCP(offer.type),
        isLongTerm: offer.type === 'LONG_TERM' ? true : false,
        offerType: offer.type
    };
}

function getOfferType(offerType: string): string {
    if (offerType === PlanTypeEnum.Promo || offerType === PlanTypeEnum.TrialExtension) {
        return offerType;
    } else if (offerType === PlanTypeEnum.RtpOffer || offerType === PlanTypeEnum.Trial || offerType === PlanTypeEnum.TrialRtp) {
        return PlanTypeEnum.Promo;
    }
    return PlanTypeEnum.Default;
}

export const getShowChoiceNotAvailableError = createSelector(getRenewalOffersAsArray, offers => {
    const fallback = offers.filter(offer => offer.fallbackReason === OfferNotAvailableReasonEnum.RADIO_INELIGIBLE_FOR_CHOICE_PLAN);
    if (fallback && fallback[0] && fallback[0].fallback) {
        return true;
    }
    return false;
});

export const getChoiceGenreRenewalPackageOptions = createSelector(getRenewalOffersAsArray, offers =>
    offers.filter(offer => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1).map(offer => offer.packageName)
);
