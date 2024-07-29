import { createAction, props } from '@ngrx/store';

export const serviceContinuityError = createAction('[Purchase] Service Continuity error', props<{ error: any }>());
