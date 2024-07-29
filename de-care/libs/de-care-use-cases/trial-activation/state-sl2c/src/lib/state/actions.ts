import { createAction, props } from '@ngrx/store';
import { Sl2cForm } from './sl2c-form.interface';
import { Sl2cSubmissionRequestInterface } from '../data-services/sl2c-submission.interface';

export const setLast4digitsOfRadioId = createAction('[Sl2c feature] Set last 4 digits of radioId', props<{ last4digits: string }>());
export const setCorpIdFromQueryParams = createAction('[Sl2c feature] Set corpId from URL query params', props<{ corpId: string }>());

export const submitSl2cForm = createAction('[Sl2c feature] Submit form', props<{ formValues: Sl2cForm }>());
export const initiateSl2cSubmission = createAction('[Sl2c feature] Initiate sl2c submission with corpId and vin', props<{ request: Sl2cSubmissionRequestInterface }>());
export const initiateNonPiiLookupAfterSl2cSubmission = createAction(
    '[Sl2c feature] Initiate non-Pii call after submission',
    props<{ accountNumber?: string; radioId: string; subscriptionId: string }>()
);
export const redirectAfterSl2cSubmission = createAction('[Sl2c feature] Redirect after sl2c submission and non-Pii', props<{ succeeded: boolean }>());

export const setTrialExpiryDate = createAction('[Sl2c feature] Set trial expiry date from non-Pii call', props<{ expiryDate: string }>());

export const setVinNumber = createAction('[SL2C] Set VIN number', props<{ vin: string }>());
export const updateCanadianProvinceIfNeeded = createAction('[SL2C] Update province on successful submission', props<{ province: string }>());
export const setSubmissionIsProcessing = createAction('[Sl2c feature] Set submission is processing to true');
export const setSubmissionIsNotProcessing = createAction('[Sl2c feature] Set submission is processing to false');
export const setFirstSubscriptionID = createAction('[Sl2c feature] Set first subscription ID', props<{ subscriptionID: string }>());
