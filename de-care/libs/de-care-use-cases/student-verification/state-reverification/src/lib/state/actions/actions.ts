import { StudentReVerificationFlowPageState } from './../reducers/reducer';
import { createAction, props } from '@ngrx/store';

export const setStudentReverificationData = createAction('[Student Re-Verification] set reverification url param data', props<StudentReVerificationFlowPageState>());
