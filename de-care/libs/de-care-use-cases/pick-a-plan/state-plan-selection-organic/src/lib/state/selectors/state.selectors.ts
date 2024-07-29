import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

export const getLandingPageInboundUrlParams = createSelector(getNormalizedQueryParams, ({ programcode: programCode, promocode }) => ({
    programCode,
    promocode,
}));
export const getAccountNumber = createSelector(selectFeature, (state) => state.accountNumber);
export const getRadioId = createSelector(selectFeature, (state) => state.radioId);
export const getPickAPlanSelectedOfferPackageName = createSelector(selectFeature, (state) => state?.selectedOfferPackageName);
export const getPickAPlanSelectedOfferPlanCode = createSelector(selectFeature, (state) => state?.selectedOfferPlanCode);
export const getCanUseDetailedGrid = createSelector(selectFeature, (state) => state?.canUseDetailedGrid);

export const getCheckoutRedirectionData = createSelector(
    getLandingPageInboundUrlParams,
    getAccountNumber,
    getRadioId,
    getPickAPlanSelectedOfferPackageName,
    (params, accountNumber, radioId, selectedPackage) => ({
        ...params,
        accountNumber,
        radioId,
        selectedPackage,
    })
);
