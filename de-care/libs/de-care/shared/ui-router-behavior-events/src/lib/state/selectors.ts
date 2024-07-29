import { selectRouteData } from '@de-care/shared/state-router-store';
import { createSelector } from '@ngrx/store';
import { ROUTE_DATA_KEY_FLOW_INFO } from '../constants';

export const selectRouteDataFlowInfo = createSelector(selectRouteData, (data) => data?.[ROUTE_DATA_KEY_FLOW_INFO]);
