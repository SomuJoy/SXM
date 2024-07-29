import { createAction, props } from '@ngrx/store';
import { VerifyTypeSelection } from '../data-services/interfaces';

const featureActionPrefix = 'Two Factor Auth';

export const setVerifyTypeSelection = createAction(`[${featureActionPrefix}] Set verification type`, props<{ verifyTypeSelection: VerifyTypeSelection }>());
export const resendPhoneVerificationCode = createAction(`[${featureActionPrefix}] Request re-send of phone verification code`, props<{ last4DigitsRadioId: string }>());
export const setPendingSecurityCodeVerification = createAction(`[${featureActionPrefix}] Set pending security code verification`);
export const setSecurityCodeVerificationCompleted = createAction(`[${featureActionPrefix}] Set security code verification completed`);
export const resetSecurityCodeVerificationCompleted = createAction(`[${featureActionPrefix}] Reset security code verification completed`);
export const resetVerificationSession = createAction(`[${featureActionPrefix}] Reset verification session`);
export const setAccountVerificationStatus = createAction(`[${featureActionPrefix}] Set account verification status`, props<{ status: string; accountNumber: string }>());
export const setRadioIdVerificationStatus = createAction(`[${featureActionPrefix}] Set radio Id verification status`, props<{ status: string }>());
export const clearVerificationStatus = createAction(`[${featureActionPrefix} Clear verification status]`);
export const setPhoneVerificationRequestCodeStatus = createAction(`[${featureActionPrefix}] Set phone verification request code status`, props<{ status: string }>());
export const requestPhoneVerification = createAction(`[${featureActionPrefix} Request phone matches account]`, props<{ phoneNumber: string; locale?: string }>());
export const phoneVerificationComplete = createAction(`[${featureActionPrefix}] phone number validation request complete`);
export const setPhoneVerificationRequestCodeLimitExceeded = createAction(`[${featureActionPrefix}] Set phone verification request code limit exceded`);
export const setResendPhoneCodeRequested = createAction(`[${featureActionPrefix}] Set Resend phone code requested`);
export const resetResendPhoneCodeRequested = createAction(`[${featureActionPrefix}] Reset Resend phone code requested`);
