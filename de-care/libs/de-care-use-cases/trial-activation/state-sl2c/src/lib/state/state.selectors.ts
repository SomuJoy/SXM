import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';

const getSalesHeroData = createSelector(getFirstOfferPlanCode, selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, (planCode, salesHero) => salesHero[planCode] || null);
export const getSalesHeroCopyVM = createSelector(getSalesHeroData, (salesHeroData) => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});
export const getOfferDescriptionVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescriptions) =>
        ({
            ...offerDescriptions[planCode],
            longDescription: undefined,
        } || null)
);

export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);
