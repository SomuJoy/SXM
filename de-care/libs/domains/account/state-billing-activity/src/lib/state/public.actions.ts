import { createAction, props } from '@ngrx/store';

export const clearBillingActivity = createAction('[Account Billing] Clear Billing Activity');
export const setHasInitLoaded = createAction(
    '[Account Billing] Set Has Initial Loaded',
    props<{
        hasInitLoaded: boolean;
    }>()
);
