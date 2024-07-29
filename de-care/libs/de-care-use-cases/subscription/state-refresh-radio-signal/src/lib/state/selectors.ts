import { createSelector } from '@ngrx/store';
import { refreshSignalFeatureState } from './reducer';
import { getAccountBillingSummaryIsInCollection, getMarketingAccountId } from '@de-care/domains/account/state-account';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';


export const getReceiverId = createSelector(refreshSignalFeatureState, (state) => state?.receiverId || null);
export const getPhoneNumber = createSelector(refreshSignalFeatureState, (state) => state?.phoneNumber || null);
export const selectMarketingAccountId = createSelector(getMarketingAccountId, (accountId) => accountId);
export const selectAccountBillingSummaryIsInCollection = createSelector(getAccountBillingSummaryIsInCollection, (isAccountInCollection) => isAccountInCollection);
export const isCanadaMode = createSelector(getIsCanadaMode, (isCanadaMode) => isCanadaMode);
export const getQueryParams = createSelector(getNormalizedQueryParams, (isCanadaMode) => isCanadaMode);
