import { createAction, props } from '@ngrx/store';
import { CreateAccountResponse } from '../data-services/create-account-response.interfaces';

export const createAccountError = createAction('[Subscriptions] Error when creating new account with subscription', props<{ error: any }>());
export const createAccountSuccess = createAction('[Subscriptions] Succesfully created new account with subscription', props<{ account: CreateAccountResponse }>());
