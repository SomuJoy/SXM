import { createAction, props } from '@ngrx/store';
import { FeatureFlagsInConfig } from './models';

export const loadFeatureFlags = createAction('[Feature flags] Load feature flags', props<{ flags: FeatureFlagsInConfig }>());
export const loadAdobeFeatureFlagsByFlagName = createAction('[Feature flags] Load Adobe feature flags by flag name', props<{ flagNames: string[] }>());
export const markAdobeFeatureFlagsByFlagNameAsConsumed = createAction('[Feature flags] Mark Adobe feature flags by flag name as consumed', props<{ flagNames: string[] }>());
export const clearAdobeFeatureFlags = createAction('[Feature flags] Clear Adobe feature flags');
