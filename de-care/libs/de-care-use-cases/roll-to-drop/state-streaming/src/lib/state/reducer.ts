import { Action, createReducer, on } from '@ngrx/store';
import {
    setSubmitOrderAsProcessing,
    setSubmitOrderAsNotProcessing,
    setFollowOnOptionSelected,
    setFollowOnOptionNotSelected,
    setCaptchaValidationProcessing,
    setCaptchaValidationNonProcessing,
} from './actions';

export const featureKey = 'rtdTrialActivationFeature';
export interface RollToDropTrialActivationState {
    loadYourInfoDataIsProcessing: boolean;
    submitOrderIsProcessing: boolean;
    followOnOptionSelected: boolean;
    captchaValidationProcessing: boolean;
}

export const initialState: RollToDropTrialActivationState = {
    loadYourInfoDataIsProcessing: false,
    submitOrderIsProcessing: false,
    followOnOptionSelected: false,
    captchaValidationProcessing: false,
};

const stateReducer = createReducer(
    initialState,
    on(setSubmitOrderAsProcessing, (state) => ({ ...state, submitPurchaseIsProcessing: true })),
    on(setSubmitOrderAsNotProcessing, (state) => ({ ...state, submitPurchaseIsProcessing: false })),
    on(setFollowOnOptionSelected, (state) => ({ ...state, followOnOptionSelected: true })),
    on(setFollowOnOptionNotSelected, (state) => ({ ...state, followOnOptionSelected: false })),
    on(setCaptchaValidationProcessing, (state) => ({ ...state, captchaValidationProcessing: true })),
    on(setCaptchaValidationNonProcessing, (state) => ({ ...state, captchaValidationProcessing: false }))
);

export function rtdTrialActivationReducer(state: RollToDropTrialActivationState, action: Action) {
    return stateReducer(state, action);
}
