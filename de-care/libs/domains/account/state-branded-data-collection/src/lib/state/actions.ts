import { createAction, props } from '@ngrx/store';

export const setCustomerDataCollection = createAction('[Info Customer Collection] Set Customer Collection Fields', props<{ customerDataCollection }>());
