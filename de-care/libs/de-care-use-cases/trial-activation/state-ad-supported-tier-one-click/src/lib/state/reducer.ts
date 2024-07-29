import { Action, createReducer, on } from '@ngrx/store';
import { setRadioId } from './actions';

export const featureKey = 'trial-activation-ad-supported-tier-one-click';
export interface TrialActivationAdSupportedTierOneClickState {
    radioId: string;
}
export const initialState: TrialActivationAdSupportedTierOneClickState = {
    radioId: null
};

const stateReducer = createReducer(
    initialState,
    on(setRadioId, (state, { radioId }) => ({ ...state, radioId }))
);

export function reducer(state: TrialActivationAdSupportedTierOneClickState, action: Action) {
    return stateReducer(state, action);
}
