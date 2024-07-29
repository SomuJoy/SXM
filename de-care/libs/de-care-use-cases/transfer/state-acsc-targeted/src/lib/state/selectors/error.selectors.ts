import { createSelector } from '@ngrx/store';
import { selectOffer, getOfferDetails } from '@de-care/domains/offers/state-offers';

export const getOfferInfoVM = createSelector(selectOffer, offer => offer);
export const getOfferDetailsVM = createSelector(getOfferDetails, offerDetails => offerDetails);
