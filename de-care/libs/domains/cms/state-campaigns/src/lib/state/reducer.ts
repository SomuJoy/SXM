import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CampaignModel } from './models';
import { setCampaignContent } from './actions';

export const featureKey = 'cmsCampaignsFeature';

export const adapter: EntityAdapter<CampaignModel> = createEntityAdapter<CampaignModel>({
    selectId: (model) => model.campaignId,
});
export const initialState: EntityState<CampaignModel> = adapter.getInitialState();
const featureReducer = createReducer(
    initialState,
    on(setCampaignContent, (state, { campaign }) => adapter.setOne(campaign, state))
);
export function reducer(state: EntityState<CampaignModel>, action: Action) {
    return featureReducer(state, action);
}
