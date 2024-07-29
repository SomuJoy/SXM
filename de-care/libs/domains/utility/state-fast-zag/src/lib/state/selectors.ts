import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { createSelector } from '@ngrx/store';

export const getProfileIDParams = createSelector(getNormalizedQueryParams, (queryParams) => queryParams?.profileID);
