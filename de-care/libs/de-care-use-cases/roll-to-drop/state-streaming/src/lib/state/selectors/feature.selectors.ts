import { createFeatureSelector } from '@ngrx/store';
import { RollToDropTrialActivationState, featureKey } from '../reducer';

export const selectFeature = createFeatureSelector<RollToDropTrialActivationState>(featureKey);
