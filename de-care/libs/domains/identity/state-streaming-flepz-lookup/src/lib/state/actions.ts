import { createAction, props } from '@ngrx/store';
import { AccountModel } from '../data-services/models';

export const setStreamingFlepzLookupAccounts = createAction('[Streaming Flepz Lookup] Set accounts', props<{ accounts: AccountModel[] }>());
export const clearStreamingFlepzLookupAccounts = createAction('[Streaming Flepz Lookup] Clear accounts');
