import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, adapter } from './reducer';
import { PartnerInfoState } from './models';

export const selectPartnerInfoFeature = createFeatureSelector<PartnerInfoState>(featureKey);

export const { selectEntities, selectAll } = adapter.getSelectors();

export const getIsInitialized = createSelector(selectPartnerInfoFeature, state => state.isInitialized);

export const getPartnerInfoMap = createSelector(selectPartnerInfoFeature, selectEntities);
export const getPartnerInfoList = createSelector(selectPartnerInfoFeature, selectAll);
