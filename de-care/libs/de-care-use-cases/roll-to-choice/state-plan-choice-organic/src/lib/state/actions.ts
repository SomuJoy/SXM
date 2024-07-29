import { createAction, props } from '@ngrx/store';
export const setAccountNumber = createAction('[Plan Choice Organic] Set Account Number', props<{ accountNumber: string }>());
export const setRadioId = createAction('[Plan Choice Organic] Set Radio Id', props<{ radioId: string }>());
export const setRenewalOfferPackageName = createAction('[Plan Choice Organic] Set Selected Package', props<{ selectedRenewalOfferPackageName: string }>());
