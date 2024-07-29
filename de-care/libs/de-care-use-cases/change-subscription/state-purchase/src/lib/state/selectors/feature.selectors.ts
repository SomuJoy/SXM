import { createFeatureSelector } from '@ngrx/store';
import { ChangeSubscriptionPurchaseState, featureKey } from '../reducer';

export const selectFeature = createFeatureSelector<ChangeSubscriptionPurchaseState>(featureKey);
