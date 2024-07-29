import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { NextBestAction } from '../data-services/data-next-best-action.service';
import { setAlerts, setAlertsLoading, setIdentificationState, setNbaActions } from './actions';


export interface NextBestActionsState {
    nbaActions: NextBestAction[];
    alerts: NextBestAction[];
    identificationState?: string;
    alertsLoading: boolean;
}

const initialState: NextBestActionsState = {
    nbaActions: [],
    alerts: [],
    identificationState: null,
    alertsLoading: false,
};

export const featureKey = 'nextBestActionsFeature';
export const selectFeatureState = createFeatureSelector<NextBestActionsState>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(setNbaActions, (state, { nbaActions }) => ({ ...state, nbaActions })),
    on(setAlerts, (state, { alerts }) => ({ ...state, alerts })),
    on(setAlertsLoading, (state, { alertsLoading }) => ({ ...state, alertsLoading })),
    on(setIdentificationState, (state, { identificationState }) => ({ ...state, identificationState }))
);
export function reducer(state: NextBestActionsState, action: Action) {
    return featureReducer(state, action);
}
