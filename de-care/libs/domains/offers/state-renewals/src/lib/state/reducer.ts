import { Action, createReducer, on } from '@ngrx/store';
import { setOfferRenewal } from './actions';
import { Offer } from '../data-services/offer-renewal.interface';

export const offerRenewalFeatureKey = 'offerRenewalFeature';

export interface OfferRenewalState {
    offers: Offer[] | null;
}

export const initialState: OfferRenewalState = {
    offers: null
};

const offerRenewalReducer = createReducer(
    initialState,
    on(setOfferRenewal, (state, { offers }) => ({ ...state, offers: offers }))
);

export function reducer(state: OfferRenewalState, action: Action) {
    return offerRenewalReducer(state, action);
}
