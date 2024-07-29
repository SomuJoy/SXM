import { createAction, props } from '@ngrx/store';

export const setFirstName = createAction('[Customer] Set first name', props<{ firstName: string }>());
export const setLastName = createAction('[Customer] Set last name', props<{ lastName: string }>());
export const setEmail = createAction('[Customer] Set email', props<{ email: string }>());
