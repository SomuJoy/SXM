import { OfferNotAvailableReasonEnum } from '@de-care/data-services';
import { Action, createReducer, on } from '@ngrx/store';
import { setFollowOnOptionNotSelected, setFollowOnOptionSelected, setSubmitOrderAsNotProcessing, setSubmitOrderAsProcessing, setDataFromStreamingToken } from './actions';

export const featureKey = 'rtdTrialActivationTokenizedFeature';

export interface RollToDropTrialActivationTokenizedState {
    followOnOptionSelected: boolean;
    submitOrderIsProcessing: boolean;
    hasValidAddress: boolean;
    maskedUserName: string;
}

const initialState: RollToDropTrialActivationTokenizedState = {
    followOnOptionSelected: false,
    submitOrderIsProcessing: false,
    hasValidAddress: false,
    maskedUserName: null
};

const rollToDropTrialActivationTokenizedReducer = createReducer(
    initialState,
    on(setFollowOnOptionSelected, state => ({ ...state, followOnOptionSelected: true })),
    on(setFollowOnOptionNotSelected, state => ({ ...state, followOnOptionSelected: false })),
    on(setSubmitOrderAsProcessing, state => ({ ...state, submitPurchaseIsProcessing: true })),
    on(setSubmitOrderAsNotProcessing, state => ({ ...state, submitPurchaseIsProcessing: false })),
    on(setDataFromStreamingToken, (state, { maskedUserName, hasValidAddress }) => ({ ...state, maskedUserName, hasValidAddress }))
);

export function reducer(state = initialState, action: Action): RollToDropTrialActivationTokenizedState {
    return rollToDropTrialActivationTokenizedReducer(state, action);
}
