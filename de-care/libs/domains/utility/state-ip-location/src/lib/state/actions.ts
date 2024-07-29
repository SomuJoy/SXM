import { createAction, props } from '@ngrx/store';

export const setProvinceFromIp = createAction('[State Ip Location] Province from ip', props<{ regionName: string; region: string }>());
export const setCountryCode = createAction('[State Ip Location] country code from ip', props<{ countryCode: string }>());
