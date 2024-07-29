import { Action, createReducer, on } from '@ngrx/store';
import { setFollowOnOffers } from './follow-on-offers.actions';

export const followOnOffersFeatureKey = 'followOnOffersFeature';
export interface FollowOnOffersState {
    followOnOffers: any[] | null;
}
const initialState: FollowOnOffersState = {
    followOnOffers: null
};

const followOnOffersReducer = createReducer(
    initialState,
    on(setFollowOnOffers, (state, { followOnOffers }) => ({ ...state, followOnOffers }))
);

export function reducer(state: FollowOnOffersState, action: Action) {
    return followOnOffersReducer(state, action);
}
