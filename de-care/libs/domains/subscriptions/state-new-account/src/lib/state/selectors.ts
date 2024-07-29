import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, NewAccountState } from './reducer';

const featureSelector = createFeatureSelector<NewAccountState>(featureKey);

export const getAccount = createSelector(featureSelector, state => state.account);

export const getAccountEmail = createSelector(getAccount, account => account.email);
