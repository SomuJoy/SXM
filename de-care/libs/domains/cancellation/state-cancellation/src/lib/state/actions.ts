import { createAction, props } from '@ngrx/store';

export const cancelSubscriptionError = createAction('[Cancel] Cancel subscription error', props<{ error: any }>());
