import { Action, createReducer, on } from '@ngrx/store';
import * as actions from './actions';

export const featureKey = 'checkoutStudentVerification';

export interface CheckoutStudentVerificationState {
    sheerIdIdentificationWidgetUrl?: string;
}

const initialState: CheckoutStudentVerificationState = {
    sheerIdIdentificationWidgetUrl: null,
};

const stateReducer = createReducer(
    initialState,
    on(actions.setSheerIdWidgetStudentVerificationUrl, (state, action) => ({ ...state, sheerIdIdentificationWidgetUrl: action.sheerIdWidgetIdentificationUrl }))
);

export function reducer(state: CheckoutStudentVerificationState, action: Action) {
    return stateReducer(state, action);
}
