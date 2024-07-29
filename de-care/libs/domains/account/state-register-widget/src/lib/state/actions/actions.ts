import { VerificationMethods } from '../types/types';
import { createAction, props } from '@ngrx/store';

export const twoFactorAuthDataNeeded = createAction('[Domains Account Register] Get 2 Factor Auth Data');
export const fetchVerificationMethods = createAction('[Domains Account Register] fetch verification methods', props<{ lastFourOfAccountNumber: string }>());
export const setVerificationMethods = createAction('[Domains Account Register] set verification Methods', props<{ verificationMethods: VerificationMethods }>());
export const fetchVerificationOptionsCompleted = createAction('[Domains Account Register] fetch Verification Options Complete', props<{ hasError }>());
