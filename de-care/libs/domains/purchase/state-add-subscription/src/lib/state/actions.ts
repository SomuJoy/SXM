import { createAction, props } from '@ngrx/store';

export const addSubscriptionError = createAction('[Purchase] Add subscription error', props<{ error: any }>());
