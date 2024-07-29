import { createAction, props } from '@ngrx/store';

export const loadModifySubscriptionOptionsForSubscriptionId = createAction(
    '[Account Management] Load modify subscription options for subscription id',
    props<{ subscriptionId: number }>()
);
export const clearAllModifySubscriptionOptions = createAction('[Account Management] Clear all modify subscription options');
