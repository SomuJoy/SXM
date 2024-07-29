import { InitialState, REDUCER_KEY } from './reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectFeature = createFeatureSelector<any, InitialState>(REDUCER_KEY);

export const selectReuseUserName = createSelector(selectFeature, state => state?.reuseUserName);
