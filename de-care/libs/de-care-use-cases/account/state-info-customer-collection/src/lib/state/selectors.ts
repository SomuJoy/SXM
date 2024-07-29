import { createSelector } from '@ngrx/store';
import { selectFeatureState } from './reducer';

export const selectCustomerInfoToSubmit = createSelector(selectFeatureState, (state) => state);
