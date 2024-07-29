import { createReducer, Action, on } from '@ngrx/store';
import { setReuseUserName } from './actions';

export const REDUCER_KEY = 'customerVerification';

export interface InitialState {
    reuseUserName: boolean;
}

export const initialState: InitialState = {
    reuseUserName: undefined,
};

const customerVerificationReducer = createReducer(
    initialState,
    on(setReuseUserName, (state, { reuseUserName }) => ({ ...state, reuseUserName }))
);

export function reducer(state: InitialState, action: Action) {
    return customerVerificationReducer(state, action);
}
