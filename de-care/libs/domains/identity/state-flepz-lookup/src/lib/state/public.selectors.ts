import { createSelector } from '@ngrx/store';
import { getFlepzLookupSubscriptions } from './selectors';

export { getFlepzLookupSubscriptions } from './selectors';

export const getClosedOrInactiveRadioDevicesAsArray = createSelector(getFlepzLookupSubscriptions, (flepzLookupSubscriptions) => {
    return flepzLookupSubscriptions.filter((flepzSubscription) => !!flepzSubscription?.radioService && flepzSubscription?.status !== 'Active');
});

export const numberOfSubscriptionsFound = createSelector(getFlepzLookupSubscriptions, (flepzLookupSubscriptions) => {
    return flepzLookupSubscriptions.length;
});

export const singleAccountResultFirstSubscription = createSelector(getFlepzLookupSubscriptions, (flepzLookupSubscriptions) =>
    flepzLookupSubscriptions.length > 0 ? flepzLookupSubscriptions[0] : null
);

export const singleAccountResultSubscriptionIsActive = createSelector(
    singleAccountResultFirstSubscription,
    (singleAccountResultFirstSubscription) => singleAccountResultFirstSubscription.status === 'Active' && singleAccountResultFirstSubscription.plans[0].type !== 'TRIAL'
);
