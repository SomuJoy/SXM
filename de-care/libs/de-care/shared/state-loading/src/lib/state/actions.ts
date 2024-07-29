import { createAction } from '@ngrx/store';

export const pageDataStartedLoading = createAction('[LOADING] Page Data Started Loading');
export const pageDataFinishedLoading = createAction('[LOADING] Page Data Finished Loading');
export const enablePageLoaderOnRouteEvent = createAction('[LOADING] Enable Page Loader on Route Event');
export const disablePageLoaderOnRouteEvent = createAction('[LOADING] Disable Page Loader on Route Event');

export const renewalRequestOnProvinceChangeStartedLoading = createAction('[LOADING] Renewal request on province change started loading');
export const renewalRequestOnProvinceChangeFinishedLoading = createAction('[LOADING] Renewal request on province change finished loading');
