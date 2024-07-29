import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerAccountsState, featureKey, selectAll, selectTotal } from './reducer';

export const selectCustomerAccountsFeature = createFeatureSelector<CustomerAccountsState>(featureKey);

export const selectAllCoustomerAccounts = createSelector(selectCustomerAccountsFeature, selectAll);

export const selectTotalAccounts = createSelector(selectCustomerAccountsFeature, selectTotal);
