import { createAction, props } from '@ngrx/store';
import { BillingActivityRecord } from './reducer';

export const setBillingActivity = createAction(
    '[Account Billing] Set Billing Activity',
    props<{
        billingActivity: BillingActivityRecord[];
    }>()
);

export const setHasActivityServerError = createAction(
    '[Account Billing] Set Has Activity Server Error',
    props<{
        hasActivityServerError: boolean;
    }>()
);
