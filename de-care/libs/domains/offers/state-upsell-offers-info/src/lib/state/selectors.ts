import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, featureKey, UpsellOffersInfoState } from './reducer';

export const selectFeature = createFeatureSelector<UpsellOffersInfoState>(featureKey);
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(selectFeature);
export const getCurrentLocale = createSelector(selectFeature, state => state.currentLocale);
export const selectUpsellOfferInfosForCurrentLocaleMappedByLeadOfferPlanCode = createSelector(getCurrentLocale, selectEntities, (locale, upsellOffersInfo) => {
    return Object.keys(upsellOffersInfo).reduce((set, key) => {
        const upsellOfferInfo = upsellOffersInfo[key];
        if (upsellOfferInfo.locale === locale) {
            return { ...set, [upsellOfferInfo.leadOfferPlanCode]: upsellOfferInfo };
        }
        return set;
    }, []);
});
