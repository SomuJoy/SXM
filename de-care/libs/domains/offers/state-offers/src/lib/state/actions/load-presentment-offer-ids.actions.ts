import { createAction, props } from '@ngrx/store';

export const setLeadOffersIds = createAction('[Offers] Set lead offers IDs', props<{ ids: string[] }>());
export const setCompatibleOffersIds = createAction('[Offers] Set compatible offers IDs', props<{ ids: string[] }>());
export const setPresentmentTestCell = createAction('[Offers] Set Presentment Test Cell', props<{ presentmentTestCell: string }>());
