import { StudentReVerificationState, featureKey } from './../reducers/reducer';
import { createFeatureSelector } from '@ngrx/store';

export const selectFeature = createFeatureSelector<StudentReVerificationState>(featureKey);
