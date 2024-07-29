import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, LoadingState } from './reducer';

const featureSelector = createFeatureSelector<LoadingState>(featureKey);

export const selectPageDataIsLoading = createSelector(featureSelector, (state) => state.pageDataLoading);
export const selectRouteEventLoadingDisabled = createSelector(featureSelector, (state) => state.routeEventLoadingDisabled);
