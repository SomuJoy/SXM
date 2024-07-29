import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { appSettingsLoaded } from './actions';
import { Settings } from './settings.interface';

export const appSettingsFeatureKey = 'appSettings';
export const selectAppSettings = createFeatureSelector<Settings>(appSettingsFeatureKey);

export const initialState = null;

export const appSettingsReducer = createReducer(
    initialState,
    on(appSettingsLoaded, (_, action) => ({ ...action.settings }))
);

// Need to wrap in function for AOT
export function getAppSettingsReducer(state, action) {
    return appSettingsReducer(state, action);
}
