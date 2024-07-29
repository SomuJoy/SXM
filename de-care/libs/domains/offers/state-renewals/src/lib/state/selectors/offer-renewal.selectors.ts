import { createSelector } from '@ngrx/store';
import { getFirstOffer } from '../../data-services/helpers';
import { selectFeature } from './feature.selectors';

export const selectOfferRenewal = createSelector(selectFeature, state => getFirstOffer(state?.offers));
export const getOfferRenewalPlanCode = createSelector(selectOfferRenewal, offer => offer?.planCode || null);

export const getRenewalOffersAsArray = createSelector(selectFeature, ({ offers }) => (Array.isArray(offers) ? offers : []));
