import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountSessionInfo, featureKey } from './reducer';

const selectFeature = createFeatureSelector<AccountSessionInfo>(featureKey);
export const getAccountSessionInfo = createSelector(selectFeature, state => ({ ...state }));
export const getAccountSessionZipCode = createSelector(selectFeature, state => state.zipCode);
