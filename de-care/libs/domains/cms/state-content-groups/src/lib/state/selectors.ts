import { EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { ContentGroup } from './models';
import { adapter, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<EntityState<ContentGroup>>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
