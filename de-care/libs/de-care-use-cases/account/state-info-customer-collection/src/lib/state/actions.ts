import { createAction, props } from '@ngrx/store';

export const setCustomerInfoToSubmit = createAction('[Info Customer Collection] Set Customer Collection Fields', props<{ infoToSubmit }>());
