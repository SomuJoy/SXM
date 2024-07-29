import { getCountry } from '@de-care/shared/state-settings';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerLocationDateFormat, quebecProvinceCode } from './constants';
import { CustomerLocale } from './models';
import { customerLocaleFeatureKey } from './reducer';
import { SxmLanguages } from '@de-care/app-common';
import { LANGUAGE_CODES } from '@de-care/shared/translation';

const langCodes = LANGUAGE_CODES;

export const getCustomerLocationFeature = createFeatureSelector<CustomerLocale>(customerLocaleFeatureKey);

export const getProvinceIsQuebec = createSelector(getCustomerLocationFeature, (state) => state?.province === quebecProvinceCode || false);

export const getSelectedProvince = createSelector(getCustomerLocationFeature, (state) => state?.province || 'None');
export const getProvinceList = createSelector(getCustomerLocationFeature, (state) => state?.provinces || []);
export const getProvince = createSelector(getSelectedProvince, getProvinceList, (selectedProvince, provinceList) => {
    if (!selectedProvince || !provinceList || !Array.isArray(provinceList)) {
        return 'None';
    }

    const foundProvinceObj = provinceList.find((prov) => prov.key === selectedProvince);

    return foundProvinceObj?.label || 'None';
});

export const getProvinceKey = createSelector(getSelectedProvince, getProvinceList, (selectedProvince, provinceList) => {
    if (!selectedProvince || !provinceList || !Array.isArray(provinceList)) {
        return 'None';
    }

    const foundProvinceObj = provinceList.find((prov) => prov.key === selectedProvince);

    return foundProvinceObj?.key || 'None';
});

export const getProvinceSelectionDisabled = createSelector(getCustomerLocationFeature, (state) => state.provinceSelectionDisabled);
export const getProvinceSelectionVisible = createSelector(getCustomerLocationFeature, (state) => state.provinceSelectionVisible);

export const getLanguage = createSelector(getCustomerLocationFeature, (state) => state.language as SxmLanguages);
export const getLanguagePrefix = createSelector(getLanguage, (lang) => lang.substring(0, 2));

export const getDateFormat = createSelector(getCountry, getLanguage, (country, lang) => {
    const locale = lang;

    switch (locale) {
        case langCodes.EN_CA:
            return CustomerLocationDateFormat.CA_EN;
        case langCodes.FR_CA:
            return CustomerLocationDateFormat.CA_FR;
        case langCodes.EN_US:
        default:
            return CustomerLocationDateFormat.US;
    }
});

export { getCountry, getIsCanadaMode } from '@de-care/shared/state-settings';
