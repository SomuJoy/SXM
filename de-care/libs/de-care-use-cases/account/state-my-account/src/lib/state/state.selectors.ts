import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getAccountSubscriptions, getAccountFirstName, selectAccount } from '@de-care/domains/account/state-account';
import { featureKey, MyAccountState } from './reducer';
import { isPlatinumVip } from '@de-care/domains/offers/state-package-descriptions';

export const selectFeature = createFeatureSelector<MyAccountState>(featureKey);
export const getActiveSatelliteSubscriptions = createSelector(getAccountSubscriptions, (subscriptions) =>
    Array.isArray(subscriptions) ? subscriptions?.filter((subscription) => subscription?.radioService?.status.toLowerCase() === 'active') : []
);

export const getRadioIdForRefreshLink = createSelector(getActiveSatelliteSubscriptions, (activeSubscriptions) =>
    activeSubscriptions?.length === 1 ? activeSubscriptions[0]?.radioService.radioId : null
);

export const getFirstNameForAuthPanel = createSelector(getAccountFirstName, (firstName) => firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1));
export const getHasAccountState = createSelector(selectAccount, (account) => !!account);

export const getFirstPvipSubscriptionIdIfOnlyOnePvipSub = createSelector(getAccountSubscriptions, (subscriptions) => {
    const pvipSubs = subscriptions?.filter((sub) => sub.plans?.every((plan) => isPlatinumVip(plan?.packageName)));
    return pvipSubs?.length === 1 ? pvipSubs[0]?.id : null;
});

export const getPlatinumBundleOverlayShowStatus = createSelector(selectFeature, (feature) => feature?.platinumBundleOverlayShowStatus);
export const getPvipOverlayShowStatus = createSelector(selectFeature, (feature) => feature?.pvipOverlayShowStatus);

export const getShowPriceChangeMessageOnAccount = createSelector(selectAccount, (account) =>
    account?.subscriptions?.some((sub) => sub?.plans?.some((plan) => plan.priceChangeMessagingType !== null && plan.priceChangeMessagingType !== '' && plan.termLength === 1))
);

export const selectSkipCancelOverlay = createSelector(selectFeature, (feature) => feature.skipCancelOverlay);
