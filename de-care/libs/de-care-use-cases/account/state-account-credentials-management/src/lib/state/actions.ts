import { createAction, props } from '@ngrx/store';
import { Platform, Source } from './reducer';

export const setAccountsData = createAction('[Registration] Set FLEPZ data', props<{ account: any }>());

export const setResetTokenUserName = createAction('[Setup Credentials] Set is agent link scenario flag to value', props<{ userName: string }>());

export const setMaskedEmailIdForEmailConfirmation = createAction('[Password Credentials] Masked username which email is sent', props<{ maskedEmailId: string }>());

export const setSelectedAccount = createAction('[Password Credentials] Set selected account', props<{ selectedAccount: any }>());
export const setResetTokenAccountData = createAction('[Password Credentials] Set selected account', props<{ resetToken: any; tokenAccountType: any }>());
export const setTokenValidity = createAction('[Password Credentials] Set selected account', props<{ isTokenInvalid: any }>());
export const setMaskedPhoneNumber = createAction('[Password Credentials] Set selected account', props<{ maskedPhoneNumber: any }>());
export const collectAllInboundQueryParams = createAction('[Setup Credentials] Collect all inbound query params', props<{ inboundQueryParams: { [key: string]: string } }>());
export const collectPlatformAndSource = createAction('[Setup Credentials] Collect user agent and source', props<{ platform: Platform; source: Source }>());
export const processInboundQueryParams = createAction('[Setup Credentials] Process inbound query params');
export const setIsUsernameSameAsemail = createAction('[Password Credentials] Set selected account', props<{ isUsernameSameAsemail: boolean }>());
export const setIsRecoverUsernameFlow = createAction('[Credential Recovery] Set is recover username flow', props<{ isRecoverUsernameFlow: boolean }>());
export const setOrganicAccountType = createAction('[Credential Recovery] Set is recover username flow', props<{ organicAccountType: any }>());

export const setIsCredentialRecoveryFlow = createAction('[Credential Recovery] Set credential recovery flow', props<{ isCredentialRecoveryFlow: any }>());
export const setUserEnteredEmailOrUsername = createAction('[Forgot Password] Set user entered email or username', props<{ userEnteredEmailOrUsername: any }>());
export const setUserEnteredEmailAndLastName = createAction(
    '[Recover Username] Set user entered email or username',
    props<{ userEnteredEmail: any; userEnteredLastname: any }>()
);
export const clearUserEnteredEmailOrUsername = createAction('[Forgot Password] Clear user entered email or username');
export const clearUserEnteredEmailAndLastName = createAction('[Recover Username] Clear user entered email or username');
