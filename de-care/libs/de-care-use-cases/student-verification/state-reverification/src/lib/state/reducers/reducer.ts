import { createReducer, Action, on } from '@ngrx/store';
import { setStudentReverificationData } from '../actions/actions';

export interface StudentReVerificationFlowPageState {
    tkn: string;
    programCode: string;
    langPref: string;
}

export const featureKey = 'studentReVerification';

export interface StudentReVerificationState {
    studentReVerificationFlowPageState: StudentReVerificationFlowPageState;
}

export const initialState: StudentReVerificationState = {
    studentReVerificationFlowPageState: null
};

const stateReducer = createReducer(
    initialState,
    on(setStudentReverificationData, (state, data) => ({
        ...state,
        studentReVerificationFlowPageState: { tkn: data?.tkn, programCode: data?.programCode, langPref: data?.langPref }
    }))
);

export function reducer(state: StudentReVerificationState, action: Action) {
    return stateReducer(state, action);
}
