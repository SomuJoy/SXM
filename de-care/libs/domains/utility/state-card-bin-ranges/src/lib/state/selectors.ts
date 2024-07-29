import { createFeatureSelector } from '@ngrx/store';
import { featureKey, StateCardBinRanges } from './reducer';

export const featureSelector = createFeatureSelector<StateCardBinRanges>(featureKey);
