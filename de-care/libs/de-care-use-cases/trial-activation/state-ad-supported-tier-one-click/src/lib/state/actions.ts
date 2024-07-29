import { createAction, props } from '@ngrx/store';

export const setRadioId = createAction('[Ad Supported tier one click] Set Radio Id', props<{ radioId: string }>());
