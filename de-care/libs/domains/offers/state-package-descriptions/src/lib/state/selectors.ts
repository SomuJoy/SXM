import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PackageDescriptionsState, featureKey, adapter } from './reducer';

export const selectFeature = createFeatureSelector<PackageDescriptionsState>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
export const getCurrentLocale = createSelector(selectFeature, state => state.currentLocale);
export const getPackageDescriptionsExist = createSelector(selectTotal, total => total > 0);
