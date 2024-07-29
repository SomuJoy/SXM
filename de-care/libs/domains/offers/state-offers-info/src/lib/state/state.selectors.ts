import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, OffersInfoState, adapter } from './reducer';
import { createEntityCompositeKey } from '../helpers';

export const selectFeature = createFeatureSelector<OffersInfoState>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
export const getCurrentLocale = createSelector(selectFeature, state => state.currentLocale);

export const selectOfferInfoByPlanCode = (planCode: string) =>
    createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => offersInfo[createEntityCompositeKey(planCode, locale)] || null);

export const selectOfferInfoLegalCopyByPlanCode = (planCode: string) =>
    createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => offersInfo[createEntityCompositeKey(planCode, locale)]?.offerDetails || '');

export const selectOfferInfoSalesHeroCopyByPlanCode = (planCode: string) =>
    createSelector(getCurrentLocale, selectEntities, (locale, offersInfo) => offersInfo[createEntityCompositeKey(planCode, locale)]?.salesHero || null);
