import { createAction, props } from '@ngrx/store';
import { NextBestAction } from '../data-services/data-next-best-action.service';

export const setNbaActions = createAction('[Next Best Actions], Set NBA actions', props<{ nbaActions: NextBestAction[] }>());
export const setAlerts = createAction('[Next Best Actions], Set Alerts', props<{ alerts: NextBestAction[] }>());
export const setAlertsLoading = createAction('[Next Best Actions], Set Alerts loading', props<{ alertsLoading: boolean }>());

export const setIdentificationState = createAction(
    '[Next Best Actions] Set identification state',
    props<{
        identificationState: string;
    }>()
);
