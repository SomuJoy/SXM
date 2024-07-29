import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, ThirPartyBillingProvisionAccountState } from './reducers';

export const selectFeature = createFeatureSelector<ThirPartyBillingProvisionAccountState>(featureKey);
export const getEntitlementResults = createSelector(selectFeature, state => state?.entitlementResults || null);
export const selectResellerCode = createSelector(getEntitlementResults, results => results?.resellerCode || null);
export const selectEntitlementError = createSelector(selectFeature, state => state?.entitlementError || null);
export const selectEntitlementId = createSelector(selectFeature, state => state?.entitlementId || null);

export const selectLoginInfo = createSelector(selectFeature, state => state?.loginInfo || null);
export const selectPartner = createSelector(selectFeature, state => state?.partnerName || null);
export const getActivationData = createSelector(selectLoginInfo, selectEntitlementId, (loginInfo, entitlementId) => ({ ...loginInfo, entitlementId }));
export const getEntitlementErrorData = createSelector(selectEntitlementId, selectEntitlementError, selectResellerCode, (entitlementId, error, resellerCode) => ({
    entitlementId,
    resellerCode,
    error
}));
export const getSelectedPartner = createSelector(selectPartner, selectResellerCode, (partnerName, resellerCode) => ({
    partnerName,
    resellerCode
}));
