import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutCommonState, featureKey } from './reducer';

export const featureState = createFeatureSelector<CheckoutCommonState>(featureKey);
export const selectInboundQueryParams = createSelector(featureState, (state) => state.inboundQueryParams);
export const getSelectedProvinceCode = createSelector(featureState, (state) => state.selectedProvinceCode);
export const getAllowLicensePlateLookup = createSelector(featureState, (state) => state.allowLicensePlateLookup);
export const getSelectedPlanCode = createSelector(featureState, (state) => state.selectedPlanCode);

export const getPayloadForUpsellsLoad = createSelector(selectInboundQueryParams, getSelectedPlanCode, getSelectedProvinceCode, (queryParams, planCode, province) => {
    if (planCode && queryParams?.upcode) {
        return {
            planCode,
            upsellCode: queryParams.upcode,
            ...(province ? { province } : {}),
        };
    } else {
        return null;
    }
});

export const getPayloadForStreamingToSatelliteUpsellsLoad = createSelector(
    selectInboundQueryParams,
    getSelectedPlanCode,
    getSelectedProvinceCode,
    (queryParams, planCode, province) => {
        if (planCode && queryParams?.satupcode) {
            return {
                planCode,
                satUpsellCode: queryParams?.satupcode,
                streaming: false,
                ...(province ? { province } : {}),
            };
        } else {
            return null;
        }
    }
);

export const getProgramcode = createSelector(selectInboundQueryParams, (params) => params?.programcode);
