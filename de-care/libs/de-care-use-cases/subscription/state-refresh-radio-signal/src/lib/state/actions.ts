import { createAction, props } from '@ngrx/store';

export const setReceiverIdFromURL = createAction('[Refresh Signal] Set Receiver Id from URL', props<{ receiverId: string }>());
export const setPhoneNumber = createAction('[Refresh Signal] Set Phone number', props<{ phoneNumber: any }>());
