import { createAction, props } from '@ngrx/store';
import { CreateAccountError, CreateAccountFormData, TransactionResultsData } from './models';

export const setIngressValuesForTrialActivationRTP = createAction(
    '[Trial activation RTP] Set ingress values',
    props<{ last4digitsOfRadioId: string | null; programCode: string | null; usedCarBrandingType: string | null; redirectURL: string | null }>()
);

export const setCreateAccountStepCompleted = createAction('[Trial activation RTP] Create account step completed');
export const setReviewStepCompleted = createAction('[Trial activation RTP] Review step completed');

export const saveCreateAccountFormData = createAction('[Trial activation RTP] Save create account form data', props<CreateAccountFormData>());
export const resetSensitiveAccountFormData = createAction('[Trial activation RTP] Reset sensitive account form data');

export const setCreateAccountError = createAction('[Trial activation RTP] Create account submission error', props<{ createAccountError: CreateAccountError }>());
export const resetCreateAccountError = createAction('[Trial activation RTP] Reset create account submission error');

export const setPrepaidRedeemUsed = createAction('[Trial activation RTP]', props<{ prepaidUsed: boolean }>());
export const setSuccessfulTransactionData = createAction('[Trial activation RTP] Set successful transaction data', props<TransactionResultsData>());

export const setProvinceFromIpLocationInfo = createAction('[Trial activation RTP] Set province form IP location info', props<{ ipAddress?: string }>());

export const setProvinceSelectorVisibleForCanada = createAction('[Trial activation RTP} Set province selector visible for Canada');
export const setProvinceSelectorDisabled = createAction('[Trial activation RTP} Set province selector disabled');
export const setProvinceSelectorEnabled = createAction('[Trial activation RTP} Set province selector enabled');
export const setIsMCPFlow = createAction('[Trial Activation RTP] User is in MCP Flow');
export const loadCustomerOffersOnProvinceChange = createAction('[Trial Activation RTP] Load Customer Offers when Province Changes To/From Quebec');
export const setIsExtRtcFlow = createAction('[Trial Activation RTP] User is in Trial Ext RTC Flow');

export const setSelectedLeadOfferByPackageName = createAction('[Trial Activation RTP] Set selected lead offer by package name', props<{ packageName: string }>());
export const setSelectedLeadOfferPlanCode = createAction('[Trial Activation RTP] Set selected lead offer plan code', props<{ planCode: string }>());

export const setCaptchaValidationProcessing = createAction('[Trial Activation RTP] Captcha Validation is processing');
export const setCaptchaValidationNonProcessing = createAction('[Trial Activation RTP] Captcha Validation non processing');
export const setDisplayNuCaptcha = createAction('[Trial Activation RTP] Set Display nucaptcha');
export const newTransactionIdDueToCreditCardError = createAction('[Trial Activation RTP] Create new transaction id due to credit card failure');
export const setTransactionId = createAction('[Trial Activation RTP] Set transaction id', props<{ transactionId: string }>());
