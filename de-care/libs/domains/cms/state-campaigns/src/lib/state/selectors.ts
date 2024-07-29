import { createFeatureSelector } from '@ngrx/store';
import { EntityState } from '@ngrx/entity';
import { CampaignModel } from './models';
import { adapter, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<EntityState<CampaignModel>>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
