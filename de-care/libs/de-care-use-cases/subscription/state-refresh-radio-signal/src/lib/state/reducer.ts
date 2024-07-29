import { Action, createReducer, createFeatureSelector, on } from '@ngrx/store';
import { setPhoneNumber, setReceiverIdFromURL } from './actions';

export const featureKey = 'Refresh Signal';
export const refreshSignalFeatureState = createFeatureSelector<RefreshSignalState>(featureKey);

export interface RefreshSignalState {
    receiverId?: string;
    phoneNumber?: any;
}

const initialState: RefreshSignalState = {};

const stateReducer = createReducer(
    initialState,
    on(setReceiverIdFromURL, (state, { receiverId }) => ({ ...state, receiverId })),
    on(setPhoneNumber, (state, { phoneNumber }) => ({ ...state, phoneNumber }))
);

export function reducer(state: RefreshSignalState, action: Action) {
    return stateReducer(state, action);
}
