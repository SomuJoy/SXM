import { Action, createReducer, on } from '@ngrx/store';
import { CreateAccountResponse } from '../data-services/create-account-response.interfaces';
import { createAccountSuccess } from './actions';

export const featureKey = 'newAccountFeature';

export interface NewAccountState {
    account: CreateAccountResponse;
}

const initialState: NewAccountState = {
    account: null
};

const newAccountReducer = createReducer(
    initialState,
    on(createAccountSuccess, (state, { account }) => ({
        ...state,
        account
    }))
);

export function reducer(state = initialState, action: Action): NewAccountState {
    return newAccountReducer(state, action);
}
