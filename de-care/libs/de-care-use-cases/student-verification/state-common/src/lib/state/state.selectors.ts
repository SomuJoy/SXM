import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';

export const getSalesHeroData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    (planCode, salesHero) => salesHero[planCode] || null
);
