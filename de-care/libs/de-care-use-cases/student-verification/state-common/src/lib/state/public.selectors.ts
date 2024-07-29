import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getSalesHeroData } from './state.selectors';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getIsCanada, getIsQuebec } from '@de-care/domains/account/state-account';

export const getSalesHeroCopyVM = createSelector(getSalesHeroData, (salesHeroData) => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            // TODO: get themes and turn these into classes that can be applied to the hero component
            //       not sure how this will work, but setting this as larger-padding for now
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});
export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);

export const getQueryParamsAndSettings = createSelector(
    getNormalizedQueryParams,
    getIsCanada,
    getIsQuebec,
    (normalizedQueryParams, isCanada, isQuebec) =>
        ({
            ...normalizedQueryParams,
            isCanada,
            isQuebec,
        } as Record<string, any>)
);
