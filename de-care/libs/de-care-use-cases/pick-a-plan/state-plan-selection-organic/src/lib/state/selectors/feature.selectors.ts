import { createFeatureSelector } from '@ngrx/store';
import { PlanChoiceOrganicState, featureKey } from '../reducer';

export const selectFeature = createFeatureSelector<PlanChoiceOrganicState>(featureKey);
