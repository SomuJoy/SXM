import { createSelector } from '@ngrx/store';
import { selectCustomerDataCollection } from './selectors';

export const getCustomerDataCollection = createSelector(selectCustomerDataCollection, (dataCollection) => dataCollection);
