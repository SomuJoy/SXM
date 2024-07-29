import { createReducer, on } from '@ngrx/store';
import { setEmail, setFirstName, setLastName } from './customer.actions';
import { CustomerPersonalInfo } from './customer.models';

export const customerFeatureKey = 'customer';

export const personalInfoInitialState: CustomerPersonalInfo = null;

export const customerPersonalReducer = createReducer(
    personalInfoInitialState,

    on(setFirstName, (state, { firstName }) => ({
        ...state,
        firstName
    })),

    on(setLastName, (state, { lastName }) => ({
        ...state,
        lastName
    })),

    on(setEmail, (state, { email }) => ({
        ...state,
        email
    }))
);

// Need to wrap in function for AOT
export function getCustomerPersonalReducer(state, action) {
    return customerPersonalReducer(state, action);
}

export const customerReducer = {
    personalInfo: getCustomerPersonalReducer
};
