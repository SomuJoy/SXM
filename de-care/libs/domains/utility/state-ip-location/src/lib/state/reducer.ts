import { createReducer, on } from '@ngrx/store';
import { setCountryCode, setProvinceFromIp } from './actions';

export const stateIpLocationFeatureKey = 'stateIpLocation';

export interface StateIpLocationState {
    regionName: string;
    countryCode: string;
    region: string;
}

export const initialState: StateIpLocationState = {
    regionName: 'ONTARIO',
    countryCode: null,
    region: 'ON',
};

export const stateIpLocationReducer = createReducer(
    initialState,
    on(setProvinceFromIp, (state, { regionName: regionName, region: region }) => ({
        ...state,
        regionName,
        region,
    })),
    on(setCountryCode, (state, { countryCode }) => ({ ...state, countryCode }))
);
