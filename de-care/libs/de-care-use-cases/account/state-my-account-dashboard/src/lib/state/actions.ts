import { createAction, props } from '@ngrx/store';

export const setHideTrending = createAction('[My Account Dashboard] Set Hide Trending', props<{ hideTrending: boolean }>());
