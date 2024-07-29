import { createAction, props } from '@ngrx/store';

export const loadCampaignContentByCampaignId = createAction('[CMS Campaigns] Load campaign content by campaign id', props<{ campaignId: string }>());
