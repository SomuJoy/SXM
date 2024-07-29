import { createFeatureSelector, createReducer, on, Action, createAction, State } from '@ngrx/store';
import {
    setPrepaidRedeemInfo,
    removePrepaidRedeemInfo,
    addPrepaidRedeemFailed,
    removePrepaidRedeemFailed,
    setAccountFormSubmitted,
    setDisplayRtcGrid,
    setAddressEditionRequired,
    resetAddressEditionRequired
} from './actions';

export interface TrialActivationRtpCreateAccountState {
    prepaidRedeemAdded: boolean;
    prepaidRedeemAmount: number;
    prepaidSuccessfullyRedeemed: boolean;
    prepaidSuccessfullyRemoved: boolean;
    createAccountFormSubmitted: boolean;
    displayRtcGrid: boolean;
    addressEditionRequired: boolean;
}

const initialState: TrialActivationRtpCreateAccountState = {
    prepaidRedeemAdded: null,
    prepaidRedeemAmount: null,
    prepaidSuccessfullyRedeemed: null,
    prepaidSuccessfullyRemoved: null,
    createAccountFormSubmitted: false,
    displayRtcGrid: false,
    addressEditionRequired: false
};

export const featureKey = 'nouvRtpCreateAccountFeature';
export const selectRtpSharedFeature = createFeatureSelector<TrialActivationRtpCreateAccountState>(featureKey);

export const nouvRtpCreateAccountFeatureReducer = createReducer(
    initialState,
    on(setPrepaidRedeemInfo, (state, { amount }) => ({
        ...state,
        prepaidRedeemAdded: true,
        prepaidRedeemAmount: amount,
        prepaidSuccessfullyRedeemed: true,
        prepaidSuccessfullyRemoved: null
    })),
    on(removePrepaidRedeemInfo, state => ({
        ...state,
        prepaidRedeemAdded: false,
        prepaidRedeemAmount: null,
        prepaidSuccessfullyRedeemed: null,
        prepaidSuccessfullyRemoved: true
    })),
    on(addPrepaidRedeemFailed, state => ({
        ...state,
        prepaidSuccessfullyRedeemed: false
    })),
    on(removePrepaidRedeemFailed, state => ({
        ...state,
        prepaidSuccessfullyRemoved: false
    })),
    on(setAccountFormSubmitted, (state, { submitted }) => ({
        ...state,
        createAccountFormSubmitted: submitted
    })),
    on(setDisplayRtcGrid, (state, { displayed }) => ({
        ...state,
        displayRtcGrid: displayed
    })),
    on(setAddressEditionRequired, state => ({ ...state, addressEditionRequired: true })),
    on(resetAddressEditionRequired, state => ({ ...state, addressEditionRequired: false }))
);

// Need to wrap in function for AOT
export function reducer(state: TrialActivationRtpCreateAccountState, action: Action) {
    return nouvRtpCreateAccountFeatureReducer(state, action);
}
