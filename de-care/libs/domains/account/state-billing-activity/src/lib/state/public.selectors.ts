import { createSelector } from '@ngrx/store';
import { selectAll, selectFeature } from './selectors';
export { selectAll as getAllRecordsAsArray, selectEntities as getAllRecords } from './selectors';

// Note: getSubscriptionRecords is no longer used, getAllNonPaymentRecords used instead in order to capture credits, adjustments, etc
export const getSubscriptionRecords = createSelector(selectAll, (allRecords) => allRecords.filter((record) => record.eventType === 'Subscription'));
export const getPaymentRecords = createSelector(selectAll, (allRecords) => allRecords.filter((record) => record.eventType === 'Payment'));
export const getAllNonPaymentRecords = createSelector(selectAll, (allRecords) => allRecords.filter((record) => record.eventType !== 'Payment'));

export const getHasInitLoaded = createSelector(selectFeature, (state) => state?.hasInitLoaded);
export const getHasActivityServerError = createSelector(selectFeature, (state) => state?.hasActivityServerError);
