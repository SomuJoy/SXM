import { createAction, props } from '@ngrx/store';

export const setReuseUserName = createAction('[Customer Verification] Set reuse user name flag', props<{ reuseUserName: boolean }>());
