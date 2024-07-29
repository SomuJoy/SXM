import { createAction, props } from '@ngrx/store';

export const changeSubscriptionError = createAction('[Purchase] Change subscription error', props<{ error: any }>());
export const offerToOfferError = createAction('[Purchase] Offer to offer error', props<{ error: any }>());
