import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    setCorpIdFromQueryParams,
    setLast4digitsOfRadioId,
    setTrialExpiryDate,
    setVinNumber,
    setSubmissionIsProcessing,
    setSubmissionIsNotProcessing,
    setFirstSubscriptionID,
} from './actions';
import { Sl2CState } from './models';

export const featureKey = 'sl2cFeature';
export const selectAppSettings = createFeatureSelector<Sl2CState>(featureKey);
const initialState: Sl2CState = {
    vin: null,
    last4digitsOfRadioId: null,
    corpId: null,
    expiryDate: null,
    submissionIsProcessing: false,
    firstSubscriptionID: null,
};

export const sl2cFeatureReducer = createReducer(
    initialState,
    on(setLast4digitsOfRadioId, (state, action) => ({ ...state, last4digitsOfRadioId: action.last4digits })),
    on(setCorpIdFromQueryParams, (state, action) => ({ ...state, corpId: action.corpId })),
    on(setTrialExpiryDate, (state, action) => ({ ...state, expiryDate: action.expiryDate })),
    on(setVinNumber, (state, action) => ({ ...state, vin: action.vin })),
    on(setSubmissionIsProcessing, (state, action) => ({ ...state, submissionIsProcessing: true })),
    on(setSubmissionIsNotProcessing, (state, action) => ({ ...state, submissionIsProcessing: false })),
    on(setFirstSubscriptionID, (state, { subscriptionID }) => ({ ...state, firstSubscriptionID: subscriptionID }))
);

// Need to wrap in function for AOT
export function reducer(state, action) {
    return sl2cFeatureReducer(state, action);
}
