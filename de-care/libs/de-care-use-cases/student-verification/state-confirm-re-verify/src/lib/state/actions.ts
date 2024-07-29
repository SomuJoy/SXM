import { createAction, props } from '@ngrx/store';
import { passFailResponse, verificationResponse } from '../data-services/verification-response.interface';
import { ProcessResultStatus } from '@de-care/domains/offers/state-eligibility';

export const reverifyGuardWorkflowStarted = createAction('[State Confirm Reverify] workflow started');
export const reverifyGuardWorkflowComplete = createAction('[State Confirm Reverify] workflow complete');
export const reverifyGuardWorkflowReset = createAction('[State Confirm Reverify] workflow reset');

export const verificationIdCheckComplete = createAction('[State Confirm Reverify] verificationId API call completed', props<{ status: verificationResponse }>());
export const o2oComplete = createAction('[State Confirm Reverify] offer-to-offer API call completed', props<{ status: passFailResponse }>());
export const changePlanComplete = createAction('[State Confirm Reverify] change-plan API call completed', props<{ status: passFailResponse }>());
export const eligibilityComplete = createAction('[State Confirm Reverify] eligibility API call completed', props<{ status: ProcessResultStatus }>());
export { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
