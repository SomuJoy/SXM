import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceLinkAmazonState, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<DeviceLinkAmazonState>(featureKey);
export const getSubscriptionId = createSelector(selectFeature, state => state.subscriptionId);
export const getRedirectUri = createSelector(selectFeature, state => state.redirectUri);
export const getAmazonUri = createSelector(selectFeature, state => state.amazonUri);
export const getAmazonAuthenticateRequestData = createSelector(getSubscriptionId, getRedirectUri, (subscriptionId, redirectUri) => ({
    subscriptionId,
    redirectUri
}));
