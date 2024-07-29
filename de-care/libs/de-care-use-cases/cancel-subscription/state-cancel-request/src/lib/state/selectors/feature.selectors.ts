import { createFeatureSelector } from '@ngrx/store';
import { CancelSubscriptionRequestState, featureKey } from '../reducer';

export const selectFeature = createFeatureSelector<CancelSubscriptionRequestState>(featureKey);
