import { createAction, props } from '@ngrx/store';
import { SecurityQuestionAnswer } from './reducer';
export {
    collectSelectedRadioIdLastFour,
    setInvalidEmailErrorForCredentialSetup,
    setInvalidFirstNameErrorForCredentialSetup,
    clearInvalidEmailErrorForCredentialSetup,
    clearInvalidFirstNameErrorForCredentialSetup,
    setSelectedAccount,
    setMaskedEmailIdForEmailConfirmation,
    setResetTokenAccountData,
    setResetTokenUserName,
    setMaskedPhoneNumber,
    setTokenValidity,
    setIsUsernameSameAsemail,
} from './actions';

export const processInboundQueryParams = createAction('[Setup Credentials] Process inbound query params');
export const findAccountPageInitialized = createAction('[Setup Credentials] Find account page initialized');
export const findAccountPageRendered = createAction('[Setup Credentials] Find account page rendered');

export const backToWelcome = createAction('[Setup Credentials] Redirect to preview');
export const backToSignInOverlay = createAction('[Setup Credentials] Redirect to sign in');
export const openPrivacyPolicyOverlay = createAction('[Setup Credentials] Open privacy policy overlay');

export const collectRegistrationServiceAddressAndPhoneNumber = createAction(
    '[Setup Credentials] Collect registration service address and phone number',
    props<{ addressAndPhone: { addressLine1: string; city: string; state: string; zip: string; avsvalidated: boolean; phoneNumber: string } }>()
);
export const collectRegistrationCredentials = createAction(
    '[Setup Credentials] Collect registration credentials',
    props<{ credentials: { username: string; password: string } }>()
);
export const collectRegistrationSecurityQuestionAnswers = createAction(
    '[Setup Credentials] Collect registration security question answers',
    props<{ securityQuestionAnswers: SecurityQuestionAnswer[] }>()
);
export const setResetTokenUserAccountType = createAction('[Setup Credentials] Set is agent link scenario flag to value', props<{ accountType: string }>());
export const setResetTokenUsername = createAction('[Setup Credentials] Set is agent link scenario flag to value', props<{ sxmUsername: string }>());
export const setIsRecoverUsernameFlow = createAction('[Credential Recovery] Set is recover username flow', props<{ isRecoverUsernameFlow: boolean }>());
export const setIsCredentialRecoveryFlow = createAction('[Credential Recovery] Set credential recovery flow', props<{ isCredentialRecoveryFlow: any }>());
export const setUserEnteredEmailOrUsername = createAction('[Forgot Password] Set user entered email or username', props<{ userEnteredEmailOrUsername: any }>());
export const setUserEnteredEmailAndLastName = createAction(
    '[Recover Username] Set user entered email or username',
    props<{ userEnteredEmail: any; userEnteredLastname: any }>()
);
export const clearUserEnteredEmailOrUsername = createAction('[Forgot Password] Clear user entered email or username');
export const clearUserEnteredEmailAndLastName = createAction('[Recover Username] Clear user entered email or username');
