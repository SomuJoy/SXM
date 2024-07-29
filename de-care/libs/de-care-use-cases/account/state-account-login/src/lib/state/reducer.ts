import { Action, createReducer, on } from '@ngrx/store';
import { collectAllInboundQueryParams, setUsernameToPrefill } from './actions';

export const featureKey = 'accountLogin';
export interface AccountLoginState {
    inboundQueryParams?: { [key: string]: string };
    usernameToPrefill?: string;
}
const initialState: AccountLoginState = {};
const stateReducer = createReducer(
    initialState,
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams: { ...state.inboundQueryParams, ...inboundQueryParams } })),
    on(setUsernameToPrefill, (state, { username }) => ({ ...state, usernameToPrefill: username }))
);
export function reducer(state: AccountLoginState, action: Action) {
    return stateReducer(state, action);
}
