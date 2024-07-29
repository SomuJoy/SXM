import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { createSelector } from '@ngrx/store';
import { featureState } from './selectors';

export const getUsernameToPrefill = createSelector(featureState, (state) => state.usernameToPrefill);
export const getRedirectInfo = createSelector(getNormalizedQueryParams, ({ redirect_uri }) =>
    redirect_uri
        ? {
              url: redirect_uri,
              isRelative: !redirect_uri.startsWith('http'),
          }
        : null
);
