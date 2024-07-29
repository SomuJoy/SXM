import { createAction, props } from '@ngrx/store';

export const setSubmitOrderAsProcessing = createAction('[RTD Trial Activation] Set submit order processing to true');
export const setSubmitOrderAsNotProcessing = createAction('[RTD Trial Activation] Set submit order processing to false');

export const setFollowOnOptionSelected = createAction('[RTD Trial Activation] Set follow-on option selected to true');
export const setFollowOnOptionNotSelected = createAction('[RTD Trial Activation] Set follow-on option selected to false');

export const setProgramCode = createAction('[RTD] Set program code', props<{ programCode: string }>());
export const setPromoCode = createAction('[RTD] Set promo code', props<{ promoCode: string }>());
export const setDataFromStreamingToken = createAction(
    '[RTD] Set masked username and hasValidAddress from streaming token',
    props<{ maskedUserName: string; hasValidAddress: boolean }>()
);
