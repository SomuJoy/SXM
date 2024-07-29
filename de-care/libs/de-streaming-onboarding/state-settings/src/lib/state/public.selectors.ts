import { createSelector } from '@ngrx/store';
import { selectAppSettings } from './reducer';

export const getLegacyOnboardingBaseUrl = createSelector(selectAppSettings, settings => settings?.legacyOnboardingBaseUrl);
