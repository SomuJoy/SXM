import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setStreamingOnboardingSettings } from './public.actions';
import { StreamingOnboardingSettings } from './settings.interface';

export const featureKey = 'streamingOnboardingSettings';
export const selectAppSettings = createFeatureSelector<StreamingOnboardingSettings>(featureKey);

export const initialState = null;

export const reducer = createReducer(
    initialState,
    on(setStreamingOnboardingSettings, (_, { settings }) => ({ ...settings }))
);

export function getStreamingOnboardingSettingsReducer(state, action) {
    return reducer(state, action);
}
