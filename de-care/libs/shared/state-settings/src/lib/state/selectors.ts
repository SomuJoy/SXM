import { createSelector } from '@ngrx/store';
import { selectAppSettings } from './reducers';

// country
export const getCountry = createSelector(selectAppSettings, settings => settings?.country);
export const getIsCanadaMode = createSelector(selectAppSettings, settings => settings?.country === 'ca' || false);
export const getMultiLanguageSupportEnabled = createSelector(getIsCanadaMode, isCanadaMode => isCanadaMode);

// oac
export const getOACUrl = createSelector(selectAppSettings, settings => settings?.oacUrl);

// api
export const getApiUrl = createSelector(selectAppSettings, settings => settings?.apiUrl);
export const getApiPath = createSelector(selectAppSettings, settings => settings?.apiPath);
export const getApiPrefix = createSelector(getApiUrl, getApiPath, (url, path) => `${url}${path}`);

// nd
export const getNdClientEnabled = createSelector(selectAppSettings, settings => settings?.ndClientEnabled);
export const getNdClientId = createSelector(selectAppSettings, settings => settings?.ndClientId);

// sheerId
export const getSheerIdIdentificationWidgetUrl = createSelector(selectAppSettings, settings => settings?.sheerIdIdentificationWidgetUrl);
export const getSheerIdIdentificationReVerificationWidgetUrl = createSelector(selectAppSettings, settings => settings?.sheerIdIdentificationReVerificationWidgetUrl);

// cvv
export const getEnableCVV = createSelector(selectAppSettings, settings => settings?.enableCVV);
export const getIsCVVEnabled = createSelector(selectAppSettings, settings => settings?.enableCVV);

// other
export const getAmzClientId = createSelector(selectAppSettings, settings => settings?.amzClientId);
export const getIsOem = createSelector(selectAppSettings, settings => settings?.isOem);
export const getLegacyOnboardingBaseUrl = createSelector(selectAppSettings, settings => settings?.legacyOnboardingBaseUrl);
