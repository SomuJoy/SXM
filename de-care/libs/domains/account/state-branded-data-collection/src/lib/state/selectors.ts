import { createSelector } from '@ngrx/store';
import { selectFeatureState } from './reducer';

export const selectCustomerDataCollection = createSelector(selectFeatureState, (state) => state?.customerDataCollection);
