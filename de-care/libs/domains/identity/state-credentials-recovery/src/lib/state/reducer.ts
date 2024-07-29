import { createReducer, on } from '@ngrx/store';
import { clearCredentialsRecoveryAccounts, setCredentialsRecoveryAccounts } from './actions';
import { AccountModel } from './models';

export const featureKey = 'identityCredentialsRecovery';

export interface CredentialsRecoveryState {
    accounts: AccountModel[];
}
const initialState: CredentialsRecoveryState = {
    accounts: [],
};

const reducer = createReducer(
    initialState,
    on(setCredentialsRecoveryAccounts, (state, { accounts }) => ({ ...state, accounts })),
    on(clearCredentialsRecoveryAccounts, (state) => ({ ...state, accounts: [] }))
);

export function getCredentialsRecoveryReducer(state, action) {
    return reducer(state, action);
}
