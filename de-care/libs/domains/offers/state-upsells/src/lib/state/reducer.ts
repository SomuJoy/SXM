import { Action, createReducer, on } from '@ngrx/store';
import { UpsellPackageModel } from '../data-services/upsell-offer.interfaces';
import { setUpsellOffers } from './actions';
import { clearUpsells } from './public.actions';

export const upsellsFeatureKey = 'upsellOffersFeature';
export interface UpsellsState {
    upsellOffers: UpsellPackageModel[] | null;
}
export const initialState: UpsellsState = {
    upsellOffers: null,
};

const upsellsReducer = createReducer(
    initialState,
    on(setUpsellOffers, (state, { upsellOffers }) => ({ ...state, upsellOffers })),
    on(clearUpsells, (state) => ({ ...state, upsellOffers: [] }))
);

export function reducer(state: UpsellsState | undefined, action: Action) {
    return upsellsReducer(state, action);
}
