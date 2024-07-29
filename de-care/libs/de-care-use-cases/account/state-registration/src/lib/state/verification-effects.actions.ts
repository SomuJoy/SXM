import { createAction, props } from '@ngrx/store';

export const fetchVerifyOptionsForUnregisteredAccount = createAction('[Registration] Verification effects: fetch verification options (unregistered account)');

export const previouslyRegisteredStatusDetermined = createAction(
    '[Registration] Verification effects: previously registered check settled',
    props<{ previouslyRegistered: boolean }>()
);
