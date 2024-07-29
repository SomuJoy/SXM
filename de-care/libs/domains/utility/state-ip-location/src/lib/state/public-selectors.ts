import { createSelector } from '@ngrx/store';
import { getCustomerLocationFeature } from './selectors';

export const getProvinceFromIp = createSelector(getCustomerLocationFeature, (state) => state.region);
export const getCountryCode = createSelector(getCustomerLocationFeature, (state) => state.countryCode);
