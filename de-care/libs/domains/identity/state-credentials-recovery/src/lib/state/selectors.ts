import { createFeatureSelector } from '@ngrx/store';
import { CredentialsRecoveryState, featureKey } from './reducer';

export const selectCredentialsRecoveryFeature = createFeatureSelector<CredentialsRecoveryState>(featureKey);
