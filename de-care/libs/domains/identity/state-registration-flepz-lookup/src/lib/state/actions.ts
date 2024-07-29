import { createAction, props } from '@ngrx/store';
import { AccountModel } from '../data-services/data-registration-flepz.service';

export const setRegistrationFlepzLookupAccounts = createAction('[Registration Flepz Lookup] Set accounts', props<{ accounts: AccountModel[] }>());
export const clearRegistrationFlepzLookupAccounts = createAction('[Registration Flepz Lookup] Clear accounts');
