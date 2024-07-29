import { createAction, props } from '@ngrx/store';

export const setAccountNumber = createAction('[Plan Choice Organic] Set Account Number', props<{ accountNumber: string }>());
export const setRadioId = createAction('[Plan Choice Organic] Set Radio Id', props<{ radioId: string }>());
export const setPickAPlanSelectedOfferPackageName = createAction('[Plan Choice Organic] Set Selected Package', props<{ selectedOfferPackageName: string }>());
export const setPickAPlanSelectedOfferPlanCode = createAction('[Plan Choice Organic] Set Selected PlanCode', props<{ selectedOfferPlanCode: string }>());
export const setCanUseDetailedGrid = createAction('[Plan Choice Organic] Set Can Use Detailed Grid', props<{ canUseDetailedGrid: boolean }>());
