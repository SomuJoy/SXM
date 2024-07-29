import { selectRouteData } from '@de-care/shared/state-router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { featureKey } from './reducer';
import { Sl2CState } from './models';
import { getSalesHeroCopyVM, getOfferDescriptionVM, getLegalCopyData } from './state.selectors';

export { getProvinceIsQuebec } from '@de-care/domains/customer/state-locale';
export { getFirstAccountSubscriptionFirstPlanEndDate } from '@de-care/domains/account/state-account';

export { getDateFormat, getLanguage } from '@de-care/domains/customer/state-locale';

export const selectSl2CFeatureState = createFeatureSelector<Sl2CState>(featureKey);
export const getLast4digitsOfRadioId = createSelector(selectSl2CFeatureState, (state) => state?.last4digitsOfRadioId || null);
export const getCorpId = createSelector(selectSl2CFeatureState, (state) => state?.corpId || null);
export const getExpiryDate = createSelector(selectSl2CFeatureState, (state) => state?.expiryDate || null);

export const getBrandingType = createSelector(selectRouteData, (routeData) => routeData?.brandingType);

export const getVinNumber = createSelector(selectSl2CFeatureState, (state) => state?.vin || null);
export const getSubmissionIsProcessing = createSelector(selectSl2CFeatureState, (state) => state?.submissionIsProcessing || false);

export const trialActivationSl2cVM = createSelector(getSalesHeroCopyVM, getOfferDescriptionVM, getLegalCopyData, (salesHeroData, offerDescriptionData, legalCopyData) => ({
    salesHeroData,
    offerDescriptionData,
    legalCopyData,
}));

export const getFirstSubscriptionID = createSelector(selectSl2CFeatureState, (state) => state?.firstSubscriptionID);
