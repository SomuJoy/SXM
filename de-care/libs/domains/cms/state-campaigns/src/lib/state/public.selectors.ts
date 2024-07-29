import { createSelector } from '@ngrx/store';
import { selectEntities } from './selectors';

export const getCampaignsHeroContentMappedByCampaignId = createSelector(selectEntities, (campaigns) => campaigns);
