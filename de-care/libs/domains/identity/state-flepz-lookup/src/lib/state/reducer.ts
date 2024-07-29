import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { SubscriptionModel } from '../data-services/models';
import { clearFlepzLookupSubscriptions, setFlepzLookupSubscriptions } from './actions';

export const flepzLookupFeatureKey = 'flepzLookup';
export const selectFlepzLookupFeature = createFeatureSelector<FlepzLookupState>(flepzLookupFeatureKey);

export interface FlepzLookupState {
    subscriptions: SubscriptionModel[];
}
const initialState: FlepzLookupState = {
    subscriptions: []
};

const reducer = createReducer(
    initialState,
    on(setFlepzLookupSubscriptions, (state, { subscriptions }) => ({ ...state, subscriptions })),
    on(clearFlepzLookupSubscriptions, state => ({ ...state, subscriptions: [] }))
);

export function getFlepzLookupReducer(state, action) {
    return reducer(state, action);
}
