import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, NextBestActionsState } from './reducer';


export const selectFeature = createFeatureSelector<NextBestActionsState>(featureKey);
