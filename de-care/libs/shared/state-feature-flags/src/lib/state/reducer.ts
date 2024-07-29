import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setAdobeFlags, setFeatureFlags } from './actions';
import { FeatureFlagsInApp } from './models';
import { clearAdobeFeatureFlags } from './public.actions';

export const featureFlagFeatureKey = 'featureFlags';
export const selectFeatureFlagState = createFeatureSelector<FeatureFlagsInApp>(featureFlagFeatureKey);

export const initialState = null;

export const featureFlagReducer = createReducer(
    initialState,
    on(setFeatureFlags, (_, action) => ({ ...action.flags })),
    on(setAdobeFlags, (state, { adobeFlags }) => ({ ...state, adobeFlags: { ...state.adobeFlags, ...adobeFlags } })),
    on(clearAdobeFeatureFlags, ({ adobeFlags, ...state }) => ({ ...state }))
);

// Need to wrap in function for AOT
export function reducer(state, action) {
    return featureFlagReducer(state, action);
}
