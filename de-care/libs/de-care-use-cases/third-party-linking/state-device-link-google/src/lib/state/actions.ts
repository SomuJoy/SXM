import { createAction, props } from '@ngrx/store';

export const setSubscriptionId = createAction('[Device Link Google] Set subscription id', props<{ subscriptionId: number }>());
