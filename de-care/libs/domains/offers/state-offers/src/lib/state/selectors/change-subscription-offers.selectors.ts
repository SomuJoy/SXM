import { createSelector } from '@ngrx/store';
import { getAllNonDataCapableOffersAsArray } from './offer.selectors';

export const getAllNonDataCapableOffersAsArraySorted = createSelector(getAllNonDataCapableOffersAsArray, (offers) => offers.sort((a, b) => a.order - b.order));
export const getAllNonDataCapableOffersUniqueByTerm = createSelector(
    getAllNonDataCapableOffersAsArraySorted,
    (offers) =>
        offers.filter(
            (offer) =>
                offer.termLength === 1 ||
                offer.type === 'PROMO' ||
                offer.type === 'TRIAL_EXT' ||
                offer.type === 'PROMO_MCP' ||
                offer.planCode === 'Promo - All Access - 3mo - $0.00' ||
                offer.planCode === 'Promo - All Access - 3mo - 0.00'
        ) // TODO: Replace Hardcoded name with type
);

export const selectChangeSubscriptionOffers = createSelector(getAllNonDataCapableOffersUniqueByTerm, (offers) => ({
    upgrades: offers.filter((offer) => offer.upgradeOffer),
    other: offers.filter((offer) => !offer.upgradeOffer),
}));
