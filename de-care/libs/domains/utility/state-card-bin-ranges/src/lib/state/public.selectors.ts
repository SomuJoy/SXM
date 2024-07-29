import { createSelector } from '@ngrx/store';
import { featureSelector } from './selectors';

export const getCardBinRanges = createSelector(featureSelector, (state) => state.cardBinRanges);
