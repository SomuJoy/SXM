import { Action, createReducer, on } from '@ngrx/store';
import { resetOffersStateToInitial, setOffers } from '../actions/load-offers.actions';
import { setLeadOffersIds, setCompatibleOffersIds, setPresentmentTestCell } from '../actions/load-presentment-offer-ids.actions';
import { Offer } from '../../data-services/offer.interface';
import { setRenewalOffers, setSelectedRenewalPackageName } from '../actions/load-renewal-offers.actions';

export const offersFeatureKey = 'offersFeature';
export interface OffersState {
    offers: Offer[] | null;
    leadOffersIds: string[];
    compatibleOffersIds: string[];
    renewalOffers: Offer[] | null;
    selectedRenewalPackageName: string | null;
    presentmentTestCell: string | null;
}
export const initialState: OffersState = {
    offers: null,
    leadOffersIds: [],
    compatibleOffersIds: [],
    renewalOffers: null,
    selectedRenewalPackageName: null,
    presentmentTestCell: null,
};

const offersReducer = createReducer(
    initialState,
    on(setOffers, (state, { offers }) => ({ ...state, offers: offers })),
    on(setLeadOffersIds, (state, { ids }) => ({ ...state, leadOffersIds: [...ids] })),
    on(setCompatibleOffersIds, (state, { ids }) => ({ ...state, compatibleOffersIds: [...ids] })),
    on(setRenewalOffers, (state, { renewalOffers }) => ({ ...state, renewalOffers })),
    on(setSelectedRenewalPackageName, (state, { selectedRenewalPackageName }) => ({ ...state, selectedRenewalPackageName })),
    on(setPresentmentTestCell, (state, { presentmentTestCell }) => ({ ...state, presentmentTestCell })),
    on(resetOffersStateToInitial, () => initialState)
);

export function reducer(state: OffersState, action: Action) {
    return offersReducer(state, action);
}
