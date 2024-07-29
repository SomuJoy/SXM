import { createFeatureSelector } from '@ngrx/store';
import { registrationFlepzLookupFeatureKey, RegistrationFlepzLookupState } from './reducer';

export const selectRegistrationFlepzLookupFeature = createFeatureSelector<RegistrationFlepzLookupState>(registrationFlepzLookupFeatureKey);
