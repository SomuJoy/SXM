import { createAction } from '@ngrx/store';

export const provinceChangedInCanada = createAction('[RTD] Province changed in Canada');
export const provinceChangedToOrFromQuebec = createAction('[RTD] Province changed to or from Quebec');
export const loadRTDStreamingDataWorkflowError = createAction('[RTD] load RTD streaming data workflow error');
export const loadRTDStreamingDataWorkflowSuccess = createAction('[RTD] load RTD streaming data workflow success');
