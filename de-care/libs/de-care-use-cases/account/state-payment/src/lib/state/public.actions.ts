import { createAction, props } from '@ngrx/store';

export const collectPaymentInformation = createAction('[Payment] Collect payment information', props<{ paymentInformation }>());
export const confirmationPageReadyToShow = createAction('[Payment] Confirmation page ready to show');
