import { createFeatureSelector } from '@ngrx/store';
import { adapter, BillingActivityRecordsState, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<BillingActivityRecordsState>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
