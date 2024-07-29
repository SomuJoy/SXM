import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EnvironmentInfoState, featureKey } from './reducer';

export const featureSelector = createFeatureSelector<EnvironmentInfoState>(featureKey);

export const getEnvironmentInfo = createSelector(featureSelector, state => state.environmentInfo);
export const getEnvironmentLoaded = createSelector(featureSelector, state => !!state.environmentInfo);

export const getPvtTime = createSelector(getEnvironmentInfo, environmentInfo => {
    if (environmentInfo && environmentInfo.buildInfo) {
        return environmentInfo.buildInfo.pvtTime;
    }
    return new Date().toString();
});

export const getSessionInfo = createSelector(getEnvironmentInfo, environmentInfo => (!!environmentInfo ? environmentInfo.sessionInfo : null));

export const getSessionInfoId = createSelector(getSessionInfo, sessionInfo => (!!sessionInfo ? sessionInfo.id : null));

export const getBuildInfo = createSelector(getEnvironmentInfo, environmentInfo => (!!environmentInfo ? environmentInfo.buildInfo : null));

export const getBuildInfoTag = createSelector(getBuildInfo, buildInfo => (!!buildInfo ? buildInfo.tag : null));
