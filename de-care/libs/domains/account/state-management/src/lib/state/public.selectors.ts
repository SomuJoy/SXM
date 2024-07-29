import { createSelector } from '@ngrx/store';
import { getContactPreferencesData, getSubscriptions } from './selectors';

export const getModifySubscriptionOptionsBySubscriptionId = (subscriptionId: number | string) =>
    createSelector(getSubscriptions, (subscriptions) => {
        return subscriptions[+subscriptionId]?.options?.options;
    });

export const getModifySubscriptionCompatibleOptionsForCancelBySubscriptionId = (subscriptionId: number | string) =>
    createSelector(getSubscriptions, (subscriptions) => {
        return subscriptions[+subscriptionId]?.options?.cancelSubscriptionOptionInfo;
    });

export const getModifyAndCancelOptionsBySubscriptionId = (subscriptionId: number | string) =>
    createSelector(getSubscriptions, (subscriptions) => {
        return subscriptions[+subscriptionId]?.options;
    });

export const getContactPreferences = createSelector(getContactPreferencesData, (contactPreferences) => contactPreferences);
