import { Action, createReducer, on } from '@ngrx/store';
import { setAmazonUri, setRedirectUri, setSubscriptionId } from './actions';

export const featureKey = 'deviceLinkAmazon';

export interface DeviceLinkAmazonState {
    subscriptionId: number;
    amazonUri: string;
    redirectUri: string;
}
const initialState: DeviceLinkAmazonState = {
    subscriptionId: null,
    amazonUri: null,
    redirectUri: null
};

const stateReducer = createReducer(
    initialState,
    on(setSubscriptionId, (state, { subscriptionId }) => ({ ...state, subscriptionId })),
    on(setRedirectUri, (state, { redirectUri }) => ({ ...state, redirectUri })),
    on(setAmazonUri, (state, { amazonUri }) => ({ ...state, amazonUri }))
);

export function reducer(state: DeviceLinkAmazonState, action: Action) {
    return stateReducer(state, action);
}
