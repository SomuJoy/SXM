import { createAction, props } from '@ngrx/store';
import { FlepzData, SecurityQuestionAnswer } from './reducer';
export { collectSelectedRadioIdLastFour, setInvalidEmailErrorForCredentialSetup, setInvalidFirstNameErrorForCredentialSetup, setIsTokenizationFlow } from './actions';

export const processInboundQueryParams = createAction('[Setup Credentials Direct Billing] Process inbound query params');
export const collectFlepzData = createAction('[Setup Credentials Direct Billing] Collect flepz data', props<{ flepzData: FlepzData }>());

export const collectRegistrationCredentials = createAction(
    '[Setup Credentials] Collect registration credentials',
    props<{ credentials: { username: string; password: string } }>()
);

export const collectRegistrationSecurityQuestionAnswers = createAction(
    '[Setup Credentials] Collect registration security question answers',
    props<{ securityQuestionAnswers: SecurityQuestionAnswer[] }>()
);

export const collectRegistrationServiceAddressAndPhoneNumber = createAction(
    '[Setup Credentials] Collect registration service address and phone number',
    props<{ addressAndPhone: { addressLine1: string; city: string; state: string; zip: string; avsvalidated: boolean; phoneNumber: string } }>()
);

export const setIsAgentLinkScenario = createAction('[Setup Credentials] Set is agent link scenario flag to value', props<{ isAgentLinkScenario: boolean }>());

export const setDeviceActivationIsForTrial = createAction('[Setup Credentials Direct Billing] Set device activation is for trial.');
export const clearDeviceActivationCode = createAction('[Setup Credentials Direct Billing] Clear device activation code.');
