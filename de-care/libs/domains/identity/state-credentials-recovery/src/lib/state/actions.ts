import { createAction, props } from '@ngrx/store';
import { AccountModel } from './models';

export const setCredentialsRecoveryAccounts = createAction('[Identity Credentials Recovery] Set accounts', props<{ accounts: AccountModel[] }>());
export const clearCredentialsRecoveryAccounts = createAction('[Identity Credentials Recovery] Clear accounts');
