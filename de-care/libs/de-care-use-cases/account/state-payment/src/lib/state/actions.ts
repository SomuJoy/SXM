import { createAction, props } from '@ngrx/store';

export const initTransactionId = createAction('[Payment] Create transaction id');
export const setTransactionIdForSession = createAction('[Payment] Set transaction id for session', props<{ transactionIdForSession: string }>());
export const newTransactionIdDueToCreditCardError = createAction('[Payment] Create new transaction id due to credit card failure');
export const setPaymentProcessSuccessful = createAction('[Payment] Set Payment process successful flag');
export const setUpdatePaymentProcessSuccessFul = createAction('[Payment] Set Update payment process successful flag');
export const clearUpdatePaymentProcessSuccessFul = createAction('[Payment] Clear Update payment process successful flag');
export const clearPaymentProcessSuccessful = createAction('[Payment] Clear Payment process successful flag');
export const setCreditCardType = createAction('[Payment] Set credit card type', props<{ cardType: string }>());
export const setConfirmationDataReady = createAction('[Payment] Set confirmation data ready');
export const captureBillingStatus = createAction('[Payment] Capture billing Status', props<{ billingSummary: any; subscriptions: any[] }>());
