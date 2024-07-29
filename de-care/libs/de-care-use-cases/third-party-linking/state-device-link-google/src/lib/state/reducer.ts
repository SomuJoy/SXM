import { Action, createReducer, on } from '@ngrx/store';
import { setSubscriptionId } from './actions';

export const featureKey = 'deviceLinkGoogle';

export interface DeviceLinkGoogleState {
    subscriptionId: number;
}
const initialState: DeviceLinkGoogleState = {
    subscriptionId: null,
};

const stateReducer = createReducer(
    initialState,
    on(setSubscriptionId, (state, { subscriptionId }) => ({ ...state, subscriptionId }))
);

export function reducer(state: DeviceLinkGoogleState, action: Action) {
    return stateReducer(state, action);
}
