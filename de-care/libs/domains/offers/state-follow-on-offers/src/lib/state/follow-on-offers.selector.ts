import { createFeatureSelector, createSelector } from '@ngrx/store';
import { followOnOffersFeatureKey, FollowOnOffersState } from './follow-on-offers.reducer';

const selectFeature = createFeatureSelector<any, FollowOnOffersState>(followOnOffersFeatureKey);

export const selectFirstFollowOnOffer = createSelector(selectFeature, state =>
    !!state.followOnOffers && Array.isArray(state.followOnOffers) && !!state.followOnOffers[0] ? state.followOnOffers[0] : null
);

export const selectFirstFollowOnOfferPlanCode = createSelector(selectFirstFollowOnOffer, followOnOffer => (!!followOnOffer ? followOnOffer.planCode : null));
