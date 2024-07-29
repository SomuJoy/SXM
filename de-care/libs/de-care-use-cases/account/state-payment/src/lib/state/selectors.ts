import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, PaymentState } from './reducer';

export const featureState = createFeatureSelector<PaymentState>(featureKey);
export const getCollectedPaymentInfo = createSelector(featureState, (state) => state.paymentInformation);
export const getTransactionId = createSelector(featureState, (state) => state.transactionIdForSession);
export const isPaymentProcessSuccessful = createSelector(featureState, (state) => state.paymentProcessSuccessful);
export const isUpdatePaymentProcessSuccessful = createSelector(featureState, (state) => state.updatePaymentProcessSuccessful);
export const getConfirmationDataReady = createSelector(featureState, (state) => state.confirmationDataReady);
