import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountLoginState, featureKey } from './reducer';

export const featureState = createFeatureSelector<AccountLoginState>(featureKey);
export const getTokenFromInboundQueryParams = createSelector(featureState, (state) => state.inboundQueryParams?.atok);
