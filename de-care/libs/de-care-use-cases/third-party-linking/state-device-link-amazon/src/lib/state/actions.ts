import { createAction, props } from '@ngrx/store';

export const setSubscriptionId = createAction('[Device Link Amazon] Set subscription id', props<{ subscriptionId: number }>());
export const buildAndSetAmazonUri = createAction('[Device Link Amazon] Build and set Amazon URI', props<{ redirectUri: string }>());
export const setRedirectUri = createAction('[Device Link Amazon] Set Redirect URI', props<{ redirectUri: string }>());
export const setAmazonUri = createAction('[Device Link Amazon] Set Amazon URI', props<{ amazonUri: string }>());
