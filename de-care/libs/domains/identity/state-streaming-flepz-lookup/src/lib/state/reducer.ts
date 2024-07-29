import { createReducer, on } from '@ngrx/store';
import { AccountModel } from '../data-services/models';
import { clearStreamingFlepzLookupAccounts, setStreamingFlepzLookupAccounts } from './actions';

export const streamingFlepzLookupFeatureKey = 'streamingFlepzLookup';

export interface StreamingFlepzLookupState {
    accounts: AccountModel[];
}
const initialState: StreamingFlepzLookupState = {
    accounts: []
};

const reducer = createReducer(
    initialState,
    on(setStreamingFlepzLookupAccounts, (state, { accounts }) => ({ ...state, accounts })),
    on(clearStreamingFlepzLookupAccounts, state => ({ ...state, accounts: [] }))
);

export function getStreamingFlepzLookupReducer(state, action) {
    return reducer(state, action);
}
