import { createAction, props } from '@ngrx/store';
import { PaymentInfo, Device, Streaming } from './models';

export { setSecondDevice, clearSecondDevice, clearPaymentInfo } from './actions';

export const captureUserSelectedSecondDevice = createAction('[Upgrade VIP] Capture user selected second device', props<{ device: Device }>());
export const captureUserSelectedStreamingPlan = createAction('[Upgrade VIP] Capture user selected streaming plan', props<{ streaming: Streaming }>());

export const captureUserSelectedUseCardOnFile = createAction('[Upgrade VIP] Capture user selected to use card on file', props<{ paymentInfo: PaymentInfo }>());
export const captureUserEnteredNewCard = createAction('[Upgrade VIP] Capture user entered new card data', props<{ paymentInfo: PaymentInfo }>());

export const setErrorCode = createAction('[Upgrade VIP] Set error code', props<{ errorCode: string }>());

export const lookupStepRequested = createAction('[Upgrade VIP] Lookup step requested');

export const organicFirstStepFromRequested = createAction('[Upgrade VIP] Organic first step form requested');
