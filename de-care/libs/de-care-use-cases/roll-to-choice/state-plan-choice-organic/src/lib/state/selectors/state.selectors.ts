import { getFirstOfferPackageName } from '@de-care/data-services';
import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';
import { getLandingPageInboundUrlParams } from './plan.selectors';

export const getAccountNumber = createSelector(selectFeature, state => state.accountNumber);
export const getRadioId = createSelector(selectFeature, state => state.radioId);
export const getSelectedPackage = createSelector(
    selectFeature,
    getFirstOfferPackageName,
    (state, leadOfferPackageName) => state.selectedRenewalOfferPackageName || leadOfferPackageName
);

export const getCheckoutRedirectionData = createSelector(
    getLandingPageInboundUrlParams,
    getAccountNumber,
    getRadioId,
    getSelectedPackage,
    (params, accountNumber, radioId, selectedPackage) => ({
        ...params,
        accountNumber,
        radioId,
        selectedPackage
    })
);
