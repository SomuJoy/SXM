import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode
} from '@de-care/domains/offers/state-offers-info';

export const getSalesHeroData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    (planCode, salesHero) => salesHero[planCode] || null
);

export const getSalesHeroCopyVM = createSelector(getSalesHeroData, salesHeroData => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            classes: 'bottom-padding'
        };
    } else {
        return null;
    }
});

export const getOfferDescriptionVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescriptions) => ({ ...offerDescriptions[planCode], presentation: 'Presentation5' } || null)
    // TODO: remove manual setting of Presentation5 to use presentation from cms once Presentation5 is configured in the cms
);

export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);
