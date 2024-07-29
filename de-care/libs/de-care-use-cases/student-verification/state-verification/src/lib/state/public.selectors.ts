import { createSelector } from '@ngrx/store';
import { getFeatureFlagEnableCmsContent } from '@de-care/shared/state-feature-flags';
import { getOfferDescriptionVM, getDealAddonVM } from './state.selectors';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
export { Offer, selectOffer } from '@de-care/domains/offers/state-offers';
export { loadFollowOnOffersForStreamingFromPlanCode, selectFirstFollowOnOffer } from '@de-care/domains/offers/state-follow-on-offers';
import { selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';

export const getSalesHeroData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    (planCode, salesHero) => salesHero[planCode] || null
);

export const getSalesHeroCopyVM = createSelector(getSalesHeroData, (salesHeroData) => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});

export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);

export const studentVerificationVM = createSelector(
    getFeatureFlagEnableCmsContent,
    getSalesHeroCopyVM,
    getOfferDescriptionVM,
    getDealAddonVM,
    getLegalCopyData,
    (cmsContentEnabled, salesHeroData, offerDescriptionData, dealAddonData, legalCopyData) => ({
        cmsContentEnabled,
        salesHeroData,
        offerDescriptionData,
        dealAddonData,
        legalCopyData,
    })
);

export { getSheerIdIdentificationWidgetUrl } from '@de-care/settings';
