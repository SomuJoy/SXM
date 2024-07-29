import { createSelector } from '@ngrx/store';
import { selectCredentialsRecoveryFeature } from './selectors';

export const credentialsRecoveryAccountsAsArray = createSelector(selectCredentialsRecoveryFeature, ({ accounts }) => (Array.isArray(accounts) ? accounts : []));
export const numberOfSubscriptionsFound = createSelector(credentialsRecoveryAccountsAsArray, (accounts) =>
    accounts.reduce((total, account) => total + account.subscriptions?.length, 0)
);
