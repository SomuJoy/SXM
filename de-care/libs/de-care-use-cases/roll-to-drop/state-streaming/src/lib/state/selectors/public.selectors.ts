import { createSelector } from '@ngrx/store';
import { getSalesHeroCopyVM, getOfferDescriptionVM, getLegalCopyData } from './state.selectors';

export const rollToDropStreamingVM = createSelector(getSalesHeroCopyVM, getOfferDescriptionVM, getLegalCopyData, (salesHeroData, offerDescriptionData, legalCopyData) => ({
    salesHeroData,
    offerDescriptionData,
    legalCopyData,
}));
