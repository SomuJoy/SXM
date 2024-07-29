import { Action, createReducer, on } from '@ngrx/store';
import {
    pageDataFinishedLoading,
    pageDataStartedLoading,
    renewalRequestOnProvinceChangeStartedLoading,
    renewalRequestOnProvinceChangeFinishedLoading,
    disablePageLoaderOnRouteEvent,
    enablePageLoaderOnRouteEvent,
} from './actions';

export const featureKey = 'loading';
export interface LoadingState {
    pageDataLoading: boolean;
    routeEventLoadingDisabled: boolean;
}

const initialState: LoadingState = {
    pageDataLoading: false,
    routeEventLoadingDisabled: false,
};

const loadingReducer = createReducer(
    initialState,
    on(pageDataStartedLoading, renewalRequestOnProvinceChangeStartedLoading, (state) => ({
        ...state,
        pageDataLoading: true,
    })),
    on(pageDataFinishedLoading, renewalRequestOnProvinceChangeFinishedLoading, (state) => ({
        ...state,
        pageDataLoading: false,
    })),
    on(enablePageLoaderOnRouteEvent, (state) => ({ ...state, routeEventLoadingDisabled: false })),
    on(disablePageLoaderOnRouteEvent, (state) => ({ ...state, routeEventLoadingDisabled: true }))
);

export function reducer(state = initialState, action: Action): LoadingState {
    return loadingReducer(state, action);
}
