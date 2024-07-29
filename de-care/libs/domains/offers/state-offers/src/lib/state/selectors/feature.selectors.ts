import { createFeatureSelector } from '@ngrx/store';
import { offersFeatureKey, OffersState } from '../reducers/offers.reducer';

export const selectFeature = createFeatureSelector<any, OffersState>(offersFeatureKey);
