import { createSelector } from '@ngrx/store';
import { selectOffer } from './offer.selectors';
import { getRenewalOffersAsArray } from './renewal-offers.selectors';

export const getRenewalOffersAsArrayForGrid = createSelector(getRenewalOffersAsArray, offersArray => {
    const packagesToDisplayOnGrid = 3;
    return offersArray && offersArray.length >= packagesToDisplayOnGrid ? offersArray?.slice(-packagesToDisplayOnGrid) : [];
});

export const getRenewalOffersPackageNamesForGrid = createSelector(getRenewalOffersAsArrayForGrid, renewalOffers =>
    renewalOffers.map(p => p.parentPackageName || p.packageName)
);

export const getRenewalPricesForGrid = createSelector(getRenewalOffersAsArrayForGrid, renewalOffers =>
    renewalOffers.map(offer => ({ pricePerMonth: offer.pricePerMonth, mrdEligible: offer.mrdEligible }))
);

export const getPlanComparisonGridParams = createSelector(selectOffer, leadOffer => ({
    selectedPackageName: leadOffer.packageName,
    familyDiscount: null,
    leadOfferPackageName: leadOffer.packageName,
    leadOfferTerm: leadOffer.termLength,
    trialEndDate: null
}));

export const getFollowOnPlanSelectionData = createSelector(selectOffer, getRenewalOffersAsArrayForGrid, (leadOffer, renewalPackages) => {
    const selectedOffer = renewalPackages && Array.isArray(renewalPackages) ? renewalPackages[0] : leadOffer;
    return {
        packages: renewalPackages,
        selectedPackageName: selectedOffer?.packageName,
        leadOfferEndDate: selectedOffer?.planEndDate
    };
});

export const getShowChoiceNotAvailableError = createSelector(getRenewalOffersAsArray, offers => {
    const fallback = offers.filter(offer => offer.fallbackReason === 'RADIO_INELIGIBLE_FOR_CHOICE_PLAN');
    if (fallback && fallback[0] && fallback[0].fallback) {
        return true;
    }
    return false;
});

export const vmPlanGridSelectors = createSelector(
    getRenewalOffersAsArrayForGrid,
    getRenewalOffersPackageNamesForGrid,
    getRenewalPricesForGrid,
    getPlanComparisonGridParams,
    getFollowOnPlanSelectionData,
    getShowChoiceNotAvailableError,
    (renewalOffersAsArray, renewalOffersPackageNamesForGrid, renewalPricesForGrid, planComparisonGridParams, followOnPlanSelectionData, showChoiceNotAvailableError) => {
        return {
            renewalOffersAsArray,
            renewalOffersPackageNamesForGrid,
            renewalPricesForGrid,
            planComparisonGridParams,
            followOnPlanSelectionData,
            showChoiceNotAvailableError
        };
    }
);
