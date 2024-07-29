import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setHideTrending } from './actions';

export interface MyAccountDashboardState {
    hideTrending: boolean;
}

const initialState: MyAccountDashboardState = {
    hideTrending: false,
};

export const featureKey = 'myAccountDashboardFeature';
export const selectFeatureState = createFeatureSelector<MyAccountDashboardState>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(setHideTrending, (state, { hideTrending }) => ({ ...state, hideTrending }))
);

export function reducer(state: MyAccountDashboardState, action: Action) {
    return featureReducer(state, action);
}
