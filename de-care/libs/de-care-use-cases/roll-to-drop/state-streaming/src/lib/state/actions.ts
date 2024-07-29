import { createAction, props } from '@ngrx/store';

export const setSubmitOrderAsProcessing = createAction('[RTD Trial Activation] Set submit order processing to true');
export const setSubmitOrderAsNotProcessing = createAction('[RTD Trial Activation] Set submit order processing to false');

export const setFollowOnOptionSelected = createAction('[RTD Trial Activation] Set follow-on option selected to true');
export const setFollowOnOptionNotSelected = createAction('[RTD Trial Activation] Set follow-on option selected to false');

export const setCaptchaValidationProcessing = createAction('[RTD Trial Activation] Captcha Validation is processing');
export const setCaptchaValidationNonProcessing = createAction('[RTD Trial Activation] Captcha Validation non processing');
