import { createAction, props } from '@ngrx/store';

export const collectAllInboundQueryParams = createAction(
    '[Setup Credentials Direct Billing] Collect all inbound query params',
    props<{ inboundQueryParams: { [key: string]: string } }>()
);
export const clearFlepzData = createAction('[Setup Credentials Direct Billing] Clear flepz data');
export const clearSuggestedRegistrationServiceAddressSuggestions = createAction('[Setup Credentials] Clear suggested registration service address suggestions');
export const collectSelectedRadioIdLastFour = createAction(
    '[Setup Credentials Direct Billing] Collect selected radio id last four',
    props<{ selectedRadioIdLastFour: string }>()
);

export const setDeviceActivationInProgress = createAction('[Setup Credentials Direct Billing] Set device activation in progress.');
export const setDeviceActivationCompleted = createAction('[Setup Credentials Direct Billing] Set device activation completed.');
export const collectDeviceActivationCode = createAction('[Setup Credentials Direct Billing] Collect device activation code.', props<{ activationCode: string }>());
export const setInvalidEmailErrorForCredentialSetup = createAction('[Setup Credentials Direct Billing] Set invalid email error', props<{ isInvalidEmailError: boolean }>());
export const setInvalidFirstNameErrorForCredentialSetup = createAction(
    '[Setup Credentials Direct Billing] Set invalid first name error',
    props<{ isInvalidFirstNameError: boolean }>()
);
export const setFreeListenCampaign = createAction(
    '[Setup Credentials Direct Billing] Set free listen campaign data',
    props<{ promoCode: string; endDate: string; isActive: boolean }>()
);
export const clearFreeListenCampaign = createAction('[Setup Credentials Direct Billing] Clear free listen campaign data');
export const setIsTokenizationFlow = createAction('[Setup Credentials Direct Billing] Set tokenization flow flag', props<{ isTokenizationFlow: boolean }>());
export const setActivationCode = createAction('[Setup Credentials Direct Billing] Set activation code', props<{ deviceActivationCode: string }>());
export const setIsSonosFlow = createAction('[Setup Credentials Direct Billing] Set Sonos flow', props<{ isSonosFlow: boolean }>());
