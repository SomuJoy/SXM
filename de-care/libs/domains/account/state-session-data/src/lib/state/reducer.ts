import { Action, createReducer, on } from '@ngrx/store';
import { resetAccountSessionInfo, setAccountSessionInfo } from './actions';

export const featureKey = 'accountSessionInfoFeature';
export interface AccountSessionInfo {
    firstName: string | null;
    lastName: string | null;
    zipCode: string | null;
    email: string | null;
    phoneNumber: string | null;
}
const initialState: AccountSessionInfo = {
    firstName: null,
    lastName: null,
    zipCode: null,
    email: null,
    phoneNumber: null
};
const stateReducer = createReducer(
    initialState,
    on(resetAccountSessionInfo, () => ({ ...initialState })),
    on(setAccountSessionInfo, (state, { sessionInfo }) => ({ ...state, ...sessionInfo }))
);
export function reducer(state: AccountSessionInfo, action: Action) {
    return stateReducer(state, action);
}
