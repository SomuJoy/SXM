import { createSelector } from '@ngrx/store';
import { selectStreamingFlepzLookupFeature } from './selectors';

export const streamingFlepzLookupAccountsAsArray = createSelector(selectStreamingFlepzLookupFeature, ({ accounts }) => (Array.isArray(accounts) ? accounts : []));
export const numberOfSubscriptionsFound = createSelector(streamingFlepzLookupAccountsAsArray, accounts =>
    accounts.reduce((total, account) => total + account.subscriptions?.length, 0)
);
export const streamingFlepzLookupSubscriptionsAsArray = createSelector(streamingFlepzLookupAccountsAsArray, accounts =>
    accounts.reduce(
        (subscriptions, account) => [
            ...subscriptions,
            ...account.subscriptions.map(subscription => ({ ...subscription, last4DigitsOfAccountNumber: account.last4DigitsOfAccountNumber }))
        ],
        []
    )
);
export const singleAccountResult = createSelector(streamingFlepzLookupAccountsAsArray, accounts => (accounts.length > 0 ? accounts[0] : null));
export const singleAccountResultSubscriptionsAsArray = createSelector(singleAccountResult, account =>
    account && Array.isArray(account.subscriptions) ? account.subscriptions : []
);
export const singleAccountResultFirstSubscription = createSelector(singleAccountResultSubscriptionsAsArray, subscriptions =>
    subscriptions.length > 0 ? subscriptions[0] : null
);
export const singleAccountResultFirstSubscriptionRadioIdLastFour = createSelector(
    singleAccountResultFirstSubscription,
    subscription => subscription?.radioService?.last4DigitsOfRadioId
);
export const singleAccountResultFirstSubscriptionInEligibleReasonCode = createSelector(
    singleAccountResultFirstSubscription,
    subscription => subscription?.inEligibleReasonCode
);
export const singleAccountResultFirstSubscriptionInEligibleService = createSelector(singleAccountResultFirstSubscription, subscription => subscription?.eligibleService);
