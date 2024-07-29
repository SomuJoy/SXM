import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoDealAddonForCurrentLocaleMappedByPlanCode
} from '@de-care/domains/offers/state-offers-info';

export const getDealAddonVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoDealAddonForCurrentLocaleMappedByPlanCode,
    (planCode, dealAddons) => dealAddons[planCode] || null
);
export const getOfferDescriptionVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescriptions) => offerDescriptions[planCode] || null
);
