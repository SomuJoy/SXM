import { Action, createReducer, on } from '@ngrx/store';
import { EnvironmentInfoModel } from '../data-services/environment-info.interface';
import { setEnvironmentInfo } from './actions';

export const featureKey = 'environmentInfoFeature';
export interface EnvironmentInfoState {
    environmentInfo: EnvironmentInfoModel | null;
}
const initialState: EnvironmentInfoState = {
    environmentInfo: null
};

const stateReducer = createReducer(
    initialState,
    on(setEnvironmentInfo, (state, action) => ({ ...state, environmentInfo: action.environmentInfo }))
);

export function reducer(state: EnvironmentInfoState, action: Action) {
    return stateReducer(state, action);
}
