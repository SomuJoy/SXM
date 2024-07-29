import { createSelector } from '@ngrx/store';
import { getSubscriptionBySubscriptionIdFromOac, getLast4DigitsOfRadioIdOfSubscriptionForSwap, getSwapNewRadioService } from './state.selectors';

export const getDataForLoadQuotesInSwap = createSelector(getSwapNewRadioService, getLast4DigitsOfRadioIdOfSubscriptionForSwap, (newRadioService, selfPayRadioId) => ({
    newRadioId: newRadioService.last4DigitsOfRadioId,
    selfPayRadioId,
}));

export const getSwapSelfPaySubscriptionPackageName = createSelector(getSubscriptionBySubscriptionIdFromOac, (subscription) => subscription?.plans?.[0]?.packageName);
export const getSwapSelfPayFullRadioId = createSelector(getSubscriptionBySubscriptionIdFromOac, (subscription) => subscription?.radioService?.radioId);
