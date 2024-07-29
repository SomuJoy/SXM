import { NextBestAction } from './../data-services/data-next-best-action.service';
import { createSelector } from '@ngrx/store';
import { selectFeature } from './selectors';

export const getNbaIdentificationState = createSelector(selectFeature, (feature) => feature?.identificationState);
export const getNbaActions = createSelector(selectFeature, (feature) => feature.nbaActions);
export const getNbaAlerts = createSelector(selectFeature, (feature) => feature.alerts);
export const getNbaAlertsLoading = createSelector(selectFeature, (state) => state.alertsLoading);
export const getNbaConvertTrialAlert = createSelector(getNbaAlerts, (alerts) => alerts.find((alert) => (alert?.endDate && alert?.type === 'CONVERT' ? alert : null)));
export const getAlertsToDisplay = createSelector(getNbaAlerts, (alerts) => alerts?.slice(0, 3));
export const getConvertTrialEndDate = createSelector(getNbaConvertTrialAlert, (trialAlert) => trialAlert?.endDate);
export const getIsAlertCritical = createSelector(getNbaAlerts, (alerts) => alerts?.[0]?.type === 'PAYMENT');
export const getAlertsCount = createSelector(getAlertsToDisplay, (alerts) => alerts?.length);
export const getAlertTypes = createSelector(getNbaAlerts, (alerts) => alerts?.map((alert: NextBestAction) => alert.type));
