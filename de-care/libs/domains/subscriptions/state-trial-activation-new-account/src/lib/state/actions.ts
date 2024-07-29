import { createAction, props } from '@ngrx/store';

export const activateTrialAccountError = createAction('[Subscriptions] Error when creating trial activation new account with subscription', props<{ error: any }>());
