import { createReducer, on } from '@ngrx/store';
import { AccountModel } from '../data-services/data-registration-flepz.service';
import { clearRegistrationFlepzLookupAccounts, setRegistrationFlepzLookupAccounts } from './actions';

export const registrationFlepzLookupFeatureKey = 'registrationFlepzLookup';

export interface RegistrationFlepzLookupState {
    accounts: AccountModel[];
}
const initialState: RegistrationFlepzLookupState = {
    accounts: [],
};

const reducer = createReducer(
    initialState,
    on(setRegistrationFlepzLookupAccounts, (state, { accounts }) => ({ ...state, accounts })),
    on(clearRegistrationFlepzLookupAccounts, (state) => ({ ...state, accounts: [] }))
);

export function getRegistrationFlepzLookupReducer(state, action) {
    return reducer(state, action);
}
