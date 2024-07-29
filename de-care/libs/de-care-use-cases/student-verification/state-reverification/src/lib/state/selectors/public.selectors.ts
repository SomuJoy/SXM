import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getFeatureFlagEnableCmsContent } from '@de-care/shared/state-feature-flags';
import { createSelector } from '@ngrx/store';
export { Offer, selectOffer } from '@de-care/domains/offers/state-offers';

export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);

export const studentReVerificationVM = createSelector(getFeatureFlagEnableCmsContent, getLegalCopyData, (cmsContentEnabled, legalCopyData) => ({
    cmsContentEnabled,
    legalCopyData,
}));
