import { getSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

export const {
    selectCurrentRoute, // select the current route
    selectFragment, // select the current route fragment
    selectQueryParams, // select the current route query params
    selectQueryParam, // factory function to select a query param
    selectRouteParams, // select the current route params
    selectRouteParam, // factory function to select a route param
    selectRouteData, // select the current route data
    selectUrl, // select the current url
} = getSelectors();

export const getNormalizedQueryParams = createSelector(selectQueryParams, (queryParams) => {
    if (!queryParams) {
        return {} as Record<string, any>;
    }

    // Lowercase all queryParams
    return Object.keys(queryParams).reduce((accum, key) => {
        accum[key.toLowerCase()] = queryParams[key];
        return accum;
    }, {}) as Record<string, any>;
});

export const getRouteSegments = createSelector(selectUrl, (state) => state.split('/'));
