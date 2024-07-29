import { createAction, props } from '@ngrx/store';
import { ProvinceInfo } from './models';

export const provinceChanged = createAction('[Customer Locale] Province changed', props<{ province: string }>());
export const setProvinceSelectionDisabled = createAction('[Customer locale] Set province selection disabled', props<{ isDisabled: boolean }>());
export const setProvinceSelectionVisible = createAction('[Customer locale] Set province selection visible', props<{ isVisible: boolean }>());

export const setProvinceSelectionVisibleIfCanada = createAction('[Customer locale] Set province selection visible for Canada', props<{ isVisible: boolean }>());

export const translationServiceLanguageChange = createAction('[Customer locale] Language change in translation service', props<{ lang: string }>());
export const userSetLanguage = createAction('[Customer locale] User set language', props<{ lang: string }>());

export const provinceListChanged = createAction('[Customer locae] Province list changed', props<{ provinces: ProvinceInfo[] }>());

export const getIpToLocationInfo = createAction('[Customer locale] Get Ip Location Info', props<{ ipAddress?: string }>());

export const setPageStartingProvince = createAction('[Customer locale] Set Page Starting Province', props<{ province: string; isDisabled: boolean }>());
