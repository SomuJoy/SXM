import { createSelector } from '@ngrx/store';
import { getSelectedOfferObject } from './state.selectors';
import { yourCurrentPlan, getCurrentFollowOnPromoPlans } from './current-plan.selectors';
import { selectFeature } from './feature.selectors';

export const getPackageChangePlanConfirmationData = createSelector(
    getSelectedOfferObject,
    yourCurrentPlan,
    getCurrentFollowOnPromoPlans,
    (selectedOffer, currentPlan, currentFollowOnPromoPlans) => ({
        selectedOffer,
        currentPlan,
        currentFollowOnPromoPlans,
    })
);

export const getPackageSelectionIsProcessing = createSelector(selectFeature, (state) => state.packageSelectionIsprocessing);

export const getChangeSubscriptionOffersError = createSelector(selectFeature, (state) => state.changeSubscriptionOffersError);
