import { createSelector } from '@ngrx/store';
import {
    getOffersBasedOnCurrentPlan,
    getOffersBasedOnSelectedPlanCode,
    getSelectedOfferObject,
    getCurrentPlanTermLength,
    getTermType,
    getSelectedInfotainmentOffers,
    getCurrentSubscriptionIsDataOnly,
    getCurrentRadioServiceIsDataCapable,
} from './state.selectors';
import { offerTypeIsSelfPay } from '@de-care/domains/offers/state-offers';

export const getCanSelectTerm = createSelector(
    getOffersBasedOnCurrentPlan,
    getSelectedOfferObject,
    getCurrentSubscriptionIsDataOnly,
    getCurrentRadioServiceIsDataCapable,
    (currentOffers, selectedOfferObject, currentSubscriptionIsDataOnly, currentRadioIsDataCapable) => {
        if (currentSubscriptionIsDataOnly) {
            return true;
        }

        if (selectedOfferObject) {
            if ((selectedOfferObject.type === 'PROMO' || selectedOfferObject.type === 'PROMO_MCP' || selectedOfferObject.type === 'TRIAL_EXT') && !currentRadioIsDataCapable) {
                return false;
            }
            return offerTypeIsSelfPay(selectedOfferObject.type);
        }

        return currentOffers.length > 1;
    }
);

const getCurrentPlanTermType = createSelector(getCurrentPlanTermLength, (termLength) => {
    let currentPlanTermType = null;
    switch (termLength) {
        case 1:
            currentPlanTermType = 'monthly';
            break;
        case 12:
            currentPlanTermType = 'annual';
            break;
    }
    return currentPlanTermType;
});

export const getTermSelectionInfo = createSelector(
    getOffersBasedOnCurrentPlan,
    getOffersBasedOnSelectedPlanCode,
    getSelectedInfotainmentOffers,
    getCurrentPlanTermType,
    (currentOffers, selectedOffers, selectedInfotainmentOffers, currentPlanTermType) => {
        const offers = selectedOffers.length > 0 ? selectedOffers : currentOffers;
        const monthly = offers.find((offer) => offer.termLength === 1);
        const annual = offers.find((offer) => offer.termLength === 12);
        let monthlyPrice = monthly?.price || 0;
        let annualPrice = annual?.price || 0;

        if (selectedInfotainmentOffers.length > 0) {
            const infotainmentMonthlyTotalPrice = selectedInfotainmentOffers
                .filter((offer) => offer.termLength === 1)
                .reduce((total, offer) => {
                    return total + offer.price;
                }, 0);
            const infotainmentAnnualTotalPrice = selectedInfotainmentOffers
                .filter((offer) => offer.termLength === 12)
                .reduce((total, offer) => {
                    return total + offer.price;
                }, 0);
            monthlyPrice += infotainmentMonthlyTotalPrice;
            annualPrice += infotainmentAnnualTotalPrice;
        }

        return {
            monthlyPrice,
            annualPrice,
            currentPlanTermType,
        };
    }
);

export const getSelectedTermInfo = createSelector(getTermSelectionInfo, getTermType, (termInfo, termType) => ({
    isAnnual: termType === 'annual',
    price: termType === 'annual' ? termInfo.annualPrice : termInfo.monthlyPrice,
}));
