import { createAction, props } from '@ngrx/store';
import { PaymentInfo, Device, DeviceCredentialsStatus, Streaming } from './models';

export const setLoadedPurchaseData = createAction('[Upgrade VIP] Set loaded purchase data for transaction', props<{ token: string }>());

export const setFirstDevice = createAction('[Upgrade VIP] Set first device', props<{ device: Device }>());
export const setSecondDevice = createAction('[Upgrade VIP] Set second device', props<{ device: Device }>());
export const clearSecondDevice = createAction('[Upgrade VIP] Clear second device');
export const setSecondDevices = createAction('[Upgrade VIP] Set second devices', props<{ secondDevices: Device[] }>());
export const setStreamingAccounts = createAction('[Upgrade VIP] Set streaming Accounts', props<{ streamingAccounts: Streaming[] }>());
export const setStreamingAccount = createAction('[Upgrade VIP] Set streaming Account', props<{ streamingAccount: Streaming }>());

export const setIsStreaming = createAction('[Upgrade VIP] Set Is Streaming Flow', props<{ isStreaming: boolean }>());

export const setPaymentMethodToUseCardOnFile = createAction('[Upgrade VIP] Set payment method to use card on file', props<{ paymentInfo: PaymentInfo }>());
export const setPaymentMethodToNewCard = createAction('[Upgrade VIP] Set payment method to new card', props<{ paymentInfo: PaymentInfo }>());
export const clearPaymentInfo = createAction('[Upgrade VIP] Clear payment info');

export const setCompleteOrderStatusAsProcessing = createAction('[Upgrage VIP] Set complete order status as processing');
export const setCompleteOrderStatusAsNotProcessing = createAction('[Upgrade VIP] Set complete order status as not processing');

export const setFirstDeviceRequestStatusAsSuccess = createAction('[Upgrade VIP] Set First Device As Success');
export const setFirstDeviceRequestStatusAsError = createAction('[Upgrade VIP] Set First Device As Error');
export const setFirstDeviceCredentialsStatus = createAction(
    '[Upgrade VIP] Set First Device Credentials Status',
    props<{ deviceCredentialsStatus: DeviceCredentialsStatus }>()
);
export const setFirstDeviceExistingMaskedUsername = createAction(
    '[Upgrade VIP] Set First Device Existing Masked username',
    props<{ firstDeviceExistingMaskedUsername: string }>()
);
export const setFirstDeviceExistingEmailOrUsername = createAction(
    '[Upgrade VIP] Set First Device Existing email or username',
    props<{ firstDeviceExistingEmailOrUsername: string }>()
);

export const setSecondDeviceRequestStatusAsSuccess = createAction('[Upgrade VIP] Set Second Device As Success');
export const setSecondDeviceRequestStatusAsError = createAction('[Upgrade VIP] Set Second Device As Error');
export const setSecondDeviceCredentialsStatus = createAction(
    '[Upgrade VIP] Set Second Device Credentials Status',
    props<{ deviceCredentialsStatus: DeviceCredentialsStatus }>()
);
export const setSecondDeviceExistingMaskedUsername = createAction(
    '[Upgrade VIP] Set Second Device Existing Masked username',
    props<{ secondDeviceExistingMaskedUsername: string }>()
);

export const setCaptchaValidationProcessing = createAction('[Upgrade VIP] Captcha Validation is processing');
export const setCaptchaValidationNonProcessing = createAction('[Upgrade VIP] Captcha Validation non processing');

export const setDisplayNuCaptcha = createAction('[Upgrade VIP] Set Display nucaptcha');

export const setProgramCode = createAction('[Upgrade VIP] Set programCode', props<{ programCode: string }>());
export const setSelectedPlanCode = createAction('[Upgrade VIP] Set Selected PlanCode', props<{ planCode: string }>());
export const setSelectedStreamingPlanCode = createAction('[Upgrade VIP] Set Selected Streaming PlanCode', props<{ streamingPlanCode: string }>());

export const setQueryParamsForCheckoutRedirect = createAction(
    '[Upgrade VIP] Set QueryParamsForCheckoutRedirect',
    props<{ userEnteredAccountNumber: string; userEnteredRadioid: string }>()
);

export const setSubscriptionIdPrimaryRadio = createAction('[Upgrade VIP] Set subscriptionId for Primary Radio', props<{ subscriptionId: string }>());
export const setSubscriptionIdSecondaryRadio = createAction('[Upgrade VIP] Set subscriptionId for Secondary Radio', props<{ subscriptionId: string }>());
export const setPlatinumPackageSubscriptionId = createAction('[Upgrade VIP] Set platinum package subscription ID', props<{ subscriptionId: string }>());
