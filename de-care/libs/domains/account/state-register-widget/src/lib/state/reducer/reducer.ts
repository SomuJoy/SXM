import { createReducer, on, Action, createFeatureSelector } from '@ngrx/store';
import { fetchVerificationOptionsCompleted, fetchVerificationMethods, setVerificationMethods } from '../actions/actions';
import { RegisterWidgetState } from '../types/types';

export const featureKey = 'registerWidget';

const RegisterWidgetInitialState: RegisterWidgetState = {
    verificationMethods: null,
    verificationOptionsStatus: {
        inProgress: false,
        hasError: false,
    },
};
export const selectRegisterWidgetState = createFeatureSelector<RegisterWidgetState>(featureKey);

const registerWidgetReducer = createReducer(
    RegisterWidgetInitialState,
    on(fetchVerificationMethods, (state) => ({ ...state, verificationOptionsStatus: { inProgress: true, hasError: false } })),
    on(fetchVerificationOptionsCompleted, (state, { hasError }) => ({ ...state, verificationOptionsStatus: { inProgress: false, hasError } })),
    on(setVerificationMethods, (state, { verificationMethods }) => ({
        ...state,
        verificationMethods: {
            phone: { eligible: verificationMethods.phone.eligible, verified: false },
            radioId: { eligible: verificationMethods.radioId.eligible, verified: false },
            accountNumber: { eligible: verificationMethods.accountNumber.eligible, verified: false },
            email: { eligible: verificationMethods.email.eligible, verified: false },
        },
    }))
);

export function reducer(state: RegisterWidgetState, action: Action) {
    return registerWidgetReducer(state, action);
}
