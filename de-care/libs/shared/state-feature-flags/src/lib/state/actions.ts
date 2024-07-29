import { createAction, props } from '@ngrx/store';
import { FeatureFlagsInApp } from './models';

export const setFeatureFlags = createAction('[Feature flags] Set parsed feature flags', props<{ flags: FeatureFlagsInApp }>());
export const setAdobeFlags = createAction('[Feature flags] Set Adobe Target feature flags', props<{ adobeFlags: { [key: string]: any } }>());
