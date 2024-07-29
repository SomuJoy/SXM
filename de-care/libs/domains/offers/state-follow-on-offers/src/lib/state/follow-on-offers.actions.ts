import { createAction, props } from '@ngrx/store';

export const loadFollowOnOffersForStreamingFromPlanCode = createAction('[Offers] Load follow on offers for streaming from plan code', props<{ planCode: string }>());
export const setFollowOnOffers = createAction('[Offers] Set follow on offers', props<{ followOnOffers: any[] }>());
export const loadFollowOnOffersError = createAction('[Offers] Error loading follow on offers', props<{ error: any }>());
