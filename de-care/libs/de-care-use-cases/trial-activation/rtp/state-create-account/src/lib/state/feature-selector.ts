import { createFeatureSelector } from '@ngrx/store';
import { featureKey, TrialActivationRtpCreateAccountState } from './reducer';

export const selectRtpCreateAccountFeature = createFeatureSelector<TrialActivationRtpCreateAccountState>(featureKey);
