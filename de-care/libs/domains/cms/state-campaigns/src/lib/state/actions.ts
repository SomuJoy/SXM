import { createAction, props } from '@ngrx/store';
import { CampaignModel } from './models';

export const loadCampaignContentError = createAction('[CMS Campaigns] Load campaign content by campaign id failed');
export const setCampaignContent = createAction('[CMS Campaigns] Set campaign content', props<{ campaign: CampaignModel }>());
