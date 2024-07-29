import { createFeatureSelector, createSelector } from '@ngrx/store';
import { upsellsFeatureKey, UpsellsState } from './reducer';

const selectFeature = createFeatureSelector<UpsellsState>(upsellsFeatureKey);

export const getAllUpsellOffers = createSelector(selectFeature, (state) => state?.upsellOffers);
export const getAllUpsellOffersAsArray = createSelector(getAllUpsellOffers, (offers) => (!!offers && Array.isArray(offers) ? offers : []));
export const getFirstUpsellOffer = createSelector(getAllUpsellOffersAsArray, (offers) => (offers.length > 0 ? offers[0] : null));
export const getUpsellsExist = createSelector(getAllUpsellOffersAsArray, (upsells) => upsells.length > 0);
export const getAllUpsellPlanCodes = createSelector(getAllUpsellOffersAsArray, (offers) => offers.map((offer) => offer.planCode));
export const getUpsellPlanCodesByType = createSelector(getAllUpsellOffersAsArray, (offers) => ({
    packageUpsellPlanCode: offers.find((offer) => offer.upsellType === 'Package')?.planCode,
    termUpsellPlanCode: offers.find((offer) => offer.upsellType === 'Term')?.planCode,
    packageAndTermUpsellPlanCode: offers.find((offer) => offer.upsellType === 'PackageAndTerm')?.planCode,
}));
export const getTermUpsellOffer = createSelector(getAllUpsellOffersAsArray, (upsellOffers) => upsellOffers?.find((offer) => offer.upsellType.toUpperCase() === 'TERM'));
