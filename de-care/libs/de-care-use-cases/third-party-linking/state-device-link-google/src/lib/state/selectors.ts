import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceLinkGoogleState, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<DeviceLinkGoogleState>(featureKey);
export const getSubscriptionId = createSelector(selectFeature, (state) => state.subscriptionId);
