import { createAction, props } from '@ngrx/store';

export const collectAllInboundQueryParams = createAction('[Account Login] Collect all inbound query params', props<{ inboundQueryParams: { [key: string]: string } }>());
export const setUsernameToPrefill = createAction('[Account Login] Set username to prefill', props<{ username: any }>());
