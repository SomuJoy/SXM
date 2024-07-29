import { createFeatureSelector } from '@ngrx/store';
import { offerRenewalFeatureKey, OfferRenewalState } from '../reducer';

export const selectFeature = createFeatureSelector<OfferRenewalState>(offerRenewalFeatureKey);
