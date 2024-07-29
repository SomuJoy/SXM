import { createAction, props } from '@ngrx/store';

export const upsellPlanCodeSelected = createAction('[Checkout] customer selected upsell plan code', props<{ planCode: string }>());
export const upsellPlanCodeUnselected = createAction('[Checkout] customer removed upsell plan code selection');
export const upsellPlanCodeChangeCompleted = createAction('[Checkout] upsell plan code change completed');
