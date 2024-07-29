import { LANGUAGE_CODES } from '@de-care/shared/state-settings';
import { createReducer, on } from '@ngrx/store';
import { provinceChanged, provinceListChanged, setProvinceSelectionDisabled, setProvinceSelectionVisible, translationServiceLanguageChange } from './actions';
import { defaultCanadianProvince } from './constants';
import { CustomerLocale } from './models';

export const customerLocaleFeatureKey = 'customerLocale';

export const initialState: CustomerLocale = {
    province: defaultCanadianProvince,
    provinceSelectionDisabled: false,
    provinceSelectionVisible: false,
    language: LANGUAGE_CODES.DEFAULT.US,
    provinces: []
};

export const customerLocaleReducer = createReducer(
    initialState,

    on(provinceChanged, (state, { province }) => ({
        ...state,
        province
    })),

    on(setProvinceSelectionDisabled, (state, action) => ({
        ...state,
        provinceSelectionDisabled: action.isDisabled
    })),
    on(setProvinceSelectionVisible, (state, action) => ({
        ...state,
        provinceSelectionVisible: action.isVisible
    })),
    on(translationServiceLanguageChange, (state, action) => ({
        ...state,
        language: action.lang
    })),
    on(provinceListChanged, (state, action) => ({
        ...state,
        provinces: action.provinces
    }))
);

// Need to wrap in function for AOT
export function getCustomerLocationReducer(state, action) {
    return customerLocaleReducer(state, action);
}
