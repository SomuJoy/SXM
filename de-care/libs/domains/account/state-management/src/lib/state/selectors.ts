import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountManagementState, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<AccountManagementState>(featureKey);
export const getSubscriptions = createSelector(selectFeature, (state) => state?.subscriptions);
export const getContactPreferencesData = createSelector(selectFeature, (state) => state?.contactPreferences);
