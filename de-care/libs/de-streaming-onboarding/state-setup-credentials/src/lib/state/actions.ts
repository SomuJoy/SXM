import { createAction, props } from '@ngrx/store';
import { FlepzData, UpdateSXIRData, Platform, Source } from './reducer';

export const collectAllInboundQueryParams = createAction('[Setup Credentials] Collect all inbound query params', props<{ inboundQueryParams: { [key: string]: string } }>());
export const collectPlatformAndSource = createAction('[Setup Credentials] Collect user agent and source', props<{ platform: Platform; source: Source }>());
export const collectFlepzData = createAction('[Setup Credentials] Collect flepz data', props<{ flepzData: FlepzData }>());
export const collectUpdateStreamingData = createAction('[Setup Credentials] Collect update streaming data', props<{ updateSXIRData: UpdateSXIRData }>());
export const clearFlepzData = createAction('[Setup Credentials] Clear flepz data');
export const clearUpdateStreamingData = createAction('[Setup Credentials] Clear update streaming data');
export const collectSelectedRadioIdLastFour = createAction('[Setup Credentials] Collect selected radio id last four', props<{ selectedRadioIdLastFour: string }>());

export const openPrivacyPolicyViaWindowOpen = createAction('[Setup Credentials] Open privacy policy in new tab using window.open');
export const doRedirectForNativeApp = createAction('[Setup Credentials] Determine native app OS and do redirect for app', props<{ response: any }>());
export const doRedirectForIOS = createAction('[Setup Credentials] Do redirect for iOS app', props<{ response: string }>());
export const doRedirectForAndroid = createAction('[Setup Credentials] Do redirect for Android app', props<{ response: string }>());
export const unsupportedPlatformForRedirect = createAction('[Setup Credentials] Redirect attempted for unsupported platform', props<{ platform: Platform }>());

export const clearRegistrationData = createAction('[Setup Credentials] Clear all registration data');
export const setSuggestedRegistrationServiceAddressSuggestions = createAction(
    '[Setup Credentials] Set suggested registration service address suggestions',
    props<{
        correctedAddresses: { addressLine1: string; city: string; state: string; zip: string }[];
        addressCorrectionAction: number;
        correctedAddressIsAvsValidated: boolean;
    }>()
);
export const clearSuggestedRegistrationServiceAddressSuggestions = createAction('[Setup Credentials] Clear suggested registration service address suggestions');
export const setInvalidEmailErrorForCredentialSetup = createAction('[Setup Credentials Direct Billing] Set invalid email error', props<{ isInvalidEmailError: boolean }>());
export const setInvalidFirstNameErrorForCredentialSetup = createAction(
    '[Setup Credentials Direct Billing] Set invalid first name error',
    props<{ isInvalidFirstNameError: boolean }>()
);
export const clearInvalidEmailErrorForCredentialSetup = createAction('[Setup Credentials Direct Billing] Set invalid email error', props<{ isInvalidEmailError: boolean }>());
export const clearInvalidFirstNameErrorForCredentialSetup = createAction(
    '[Setup Credentials Direct Billing] Set invalid first name error',
    props<{ isInvalidFirstNameError: boolean }>()
);
export const setAccountsData = createAction('[Registration] Set FLEPZ data', props<{ account: any }>());
export const setMaskedEmailIdForEmailConfirmation = createAction('[Password Credentials] Masked username which email is sent', props<{ maskedEmailId: string }>());
export const setSelectedAccount = createAction('[Password Credentials] Set selected account', props<{ selectedAccount: any }>());
export const setResetTokenAccountData = createAction('[Password Credentials] Set selected account', props<{ resetToken: any; tokenAccountType: any }>());
export const setResetTokenUserName = createAction('[Setup Credentials] Set is agent link scenario flag to value', props<{ userName: string }>());
export const setMaskedPhoneNumber = createAction('[Password Credentials] Set selected account', props<{ maskedPhoneNumber: any }>());
export const setTokenValidity = createAction('[Password Credentials] Set selected account', props<{ isTokenInvalid: any }>());
export const setIsUsernameSameAsemail = createAction('[Password Credentials] Set selected account', props<{ isUsernameSameAsemail: boolean }>());
