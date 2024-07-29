import { ProcessResultStatus } from '@de-care/domains/offers/state-eligibility';
import { Action, createReducer, on } from '@ngrx/store';
import { passFailResponse, verificationResponse } from '../data-services/verification-response.interface';
import { changePlanComplete, eligibilityComplete, o2oComplete, reverifyGuardWorkflowReset, reverifyGuardWorkflowStarted, verificationIdCheckComplete } from './actions';
export const featureKey = 'workflowStateStudentReverifyGuard';

export interface StudentReverifyGuardState {
    verificationIdStatus: verificationResponse | null;
    o2oStatus: passFailResponse | null;
    changePlanStatus: passFailResponse | null;
    eligibilityResult: ProcessResultStatus | null;
}

export const initialState: StudentReverifyGuardState = {
    verificationIdStatus: null,
    o2oStatus: null,
    changePlanStatus: null,
    eligibilityResult: null
};

const stateReducer = createReducer(
    initialState,
    on(reverifyGuardWorkflowStarted, reverifyGuardWorkflowReset, () => ({ ...initialState })),
    on(verificationIdCheckComplete, (state, action) => ({ ...state, verificationIdStatus: action.status })),
    on(o2oComplete, (state, action) => ({ ...state, o2oStatus: action.status })),
    on(changePlanComplete, (state, action) => ({ ...state, changePlanStatus: action.status })),
    on(eligibilityComplete, (state, action) => ({ ...state, eligibilityResult: action.status }))
);

export function reducer(state: StudentReverifyGuardState, action: Action) {
    return stateReducer(state, action);
}
