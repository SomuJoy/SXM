import { createSelector } from '@ngrx/store';
import {
    getAccountSubscriptions,
    getIsCanada,
    getIsQuebec,
    accountPlanTypeIsTrial,
    getAccountVehicleInfo,
    isPlanAviation,
    isPlanMarine,
} from '@de-care/domains/account/state-account';
import { getAllNonDataCapableOffersAsArray } from '@de-care/domains/offers/state-offers';
import { selectFeature } from './feature.selectors';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { getAdobeFeatureFlags } from '@de-care/shared/state-feature-flags';
import { AdobeFlagEnum } from '../../adobe-flag.enum';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const getSubscriptionId = createSelector(selectFeature, (state) => state.subscriptionId);
export const getCancelReason = createSelector(selectFeature, (state) => state.cancelReason);
export const getTransactionId = createSelector(selectFeature, (state) => state.transactionId);
export const getCancelOnly = createSelector(selectFeature, (state) => state.cancelOnly);

export const getCurrentUTCDayHour = createSelector(selectFeature, (state) => state.currentUTCDayHour);
export const getCurrentUTCDay = createSelector(getCurrentUTCDayHour, (dayHour) => dayHour.day);
export const getCurrentUTCHour = createSelector(getCurrentUTCDayHour, (dayHour) => dayHour.hour);
export const getIsChatOpen = createSelector(
    getCurrentUTCDay,
    getCurrentUTCHour,
    (day, hour) =>
        /* Monday - Friday 8 AM - 11 PM, Saturday - Sunday 8 AM - 8 PM */
        ((day === 6 || day === 0) && hour >= 12 && hour <= 23) || (day !== 6 && day !== 0 && hour >= 12 && hour <= 23) || (day !== 1 && day !== 0 && hour <= 2)
);
export const getIs247ChatOpen = createSelector(
    getCurrentUTCDay,
    getCurrentUTCHour,
    (day, hour) =>
        /* Monday - Saturday 8 AM - 11 PM, Sunday 8 AM - 8 PM */
        (hour >= 12 && hour <= 23) || (day !== 1 && hour <= 2)
);
export const getChatHourClosed = createSelector(getCurrentUTCDay, getCurrentUTCHour, (day, hour) => ((day === 6 && hour > 2) || (day === 0 && hour < 12) ? '8pm' : '11pm'));

export const getCurrentSubscription = createSelector(getAccountSubscriptions, getSubscriptionId, (accountSubscriptions, subscriptionId) => {
    const subscriptionIdString = subscriptionId && subscriptionId.toString();
    return accountSubscriptions && subscriptionIdString ? accountSubscriptions.find((subscription) => subscription.id === subscriptionIdString) : null;
});
export const getCurrentSubscriptionBasePlan = createSelector(getCurrentSubscription, (currentSubscription) => currentSubscription?.plans?.find((plan) => plan.isBasePlan));
export const getCurrentSubscriptionFollowonPlans = createSelector(getCurrentSubscription, (currentPlan) => currentPlan?.followonPlans);
export const getCurrentSubscriptionBaseFollowonPlan = createSelector(getCurrentSubscriptionFollowonPlans, (followOnPlans) => followOnPlans?.find((plan) => plan.isBasePlan));
export const getCurrentPlanIsTrial = createSelector(getCurrentSubscriptionBasePlan, (plan) => accountPlanTypeIsTrial(plan?.type));

export const getPackageNameForCurrentSubscription = createSelector(getCurrentSubscription, (subscription) => subscription?.plans[0]?.packageName);
export const getPlanTypeForCurrentSubscription = createSelector(getCurrentSubscription, (subscription) => subscription?.plans[0]?.type);

export const getInboundPackageDescriptionName = createSelector(
    getPackageNameForCurrentSubscription,
    getPlanTypeForCurrentSubscription,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (packageName, type, packageDescriptions) => {
        const packageDescription = packageDescriptions?.[packageName];
        return packageDescription?.packageOverride?.filter((override) => override?.type === type)?.[0]?.name || packageDescription?.name;
    }
);

export const getCurrentSubscriptionPlanSummary = createSelector(
    getCurrentSubscriptionBasePlan,
    getCurrentPlanIsTrial,
    getIsCanada,
    getIsQuebec,
    getInboundPackageDescriptionName,
    (plan, currentPlanIsTrial, isCanada, isQuebec, name) => {
        return {
            isDataCapableOrAviationMarine: plan?.dataCapable || isPlanAviation(plan?.capabilities) || isPlanMarine(plan?.capabilities),
            planCode: plan && plan.code,
            packageName: plan && plan.packageName,
            type: plan && plan.type,
            termLength: plan && plan.termLength,
            price: plan && plan.price,
            endDate: plan && plan.endDate,
            marketType: plan && plan.marketType,
            isCanada,
            isTrial: currentPlanIsTrial,
            isQuebec,
            name,
            withoutFees: isQuebec,
            promoShowTotalPrice: isCanada,
        };
    }
);

export const getCurrentSubscriptionPaidFollowOnPlan = createSelector(getCurrentSubscriptionBaseFollowonPlan, (followOnPlan) =>
    followOnPlan?.type !== 'TRIAL' && followOnPlan?.type !== 'PROMO' && followOnPlan?.type !== 'PROMO_MCP' && followOnPlan?.type !== 'TRIAL_EXT' ? followOnPlan : null
);

export const yourCurrentPlan = createSelector(
    getCurrentSubscription,
    getCurrentSubscriptionPlanSummary,
    getCurrentSubscriptionPaidFollowOnPlan,
    getAccountVehicleInfo,
    (currentSubscription, currentPlanSummary, paidFollowOnPlan, vehicleInfo) => {
        const streamingOnly = currentSubscription.radioService === null;
        const isEndOfCycle = currentPlanSummary?.isTrial || (currentPlanSummary?.type === 'PROMO' && currentPlanSummary?.price === 0 && currentPlanSummary?.endDate != null);
        const isNotPaid =
            currentPlanSummary?.type === 'TRIAL' || currentPlanSummary.type === 'PROMO' || currentPlanSummary.type === 'PROMO_MCP' || currentPlanSummary.type === 'TRIAL_EXT';
        return currentPlanSummary
            ? {
                  ...currentPlanSummary,
                  isEndOfCycle,
                  vehicleInfo,
                  streamingOnly,
                  subscriptionId: currentSubscription.id,
                  fullPrice: isNotPaid ? paidFollowOnPlan?.price / paidFollowOnPlan?.termLength : currentPlanSummary?.price / currentPlanSummary?.termLength,
              }
            : null;
    }
);

export const getCurrentSubscriptionBaseFollowOnPlanSummary = createSelector(
    getCurrentSubscriptionBaseFollowonPlan,
    getIsCanada,
    getIsQuebec,
    (followOnPlan, isCanada, isQuebec) =>
        !!followOnPlan
            ? {
                  packageName: followOnPlan && followOnPlan.packageName,
                  type: followOnPlan && followOnPlan.type,
                  termLength: followOnPlan && followOnPlan.termLength,
                  price: followOnPlan && followOnPlan.price,
                  endDate: followOnPlan && followOnPlan.endDate,
                  isCanada,
                  isQuebec,
                  isFollowon: true,
              }
            : null
);

export const getCurrentSubscriptionFirstPaidFollowOnPlan = createSelector(getCurrentSubscriptionFollowonPlans, (followOnPlans) =>
    followOnPlans?.find((plan) => plan.type === 'SELF_PAID')
);

export const getFollowonPlanWithFullPrice = createSelector(
    getCurrentSubscriptionBaseFollowOnPlanSummary,
    getCurrentSubscriptionFirstPaidFollowOnPlan,
    (followOnPlanSummary, paidFollowOnPlan) => {
        const isNotPaid =
            followOnPlanSummary?.type === 'TRIAL' ||
            followOnPlanSummary?.type === 'PROMO' ||
            followOnPlanSummary?.type === 'PROMO_MCP' ||
            followOnPlanSummary?.type === 'TRIAL_EXT';

        return followOnPlanSummary
            ? {
                  ...followOnPlanSummary,
                  fullPrice: isNotPaid ? paidFollowOnPlan?.price : followOnPlanSummary?.price,
                  fullPriceTermLength: isNotPaid ? paidFollowOnPlan?.termLength : followOnPlanSummary?.termLength,
              }
            : null;
    }
);

export const getFollowonPlan = createSelector(yourCurrentPlan, getFollowonPlanWithFullPrice, (currentPlan, followOnPlan) =>
    currentPlan.type === 'TRIAL' ? followOnPlan : null
);

export const getPlanType = createSelector(getCurrentSubscriptionPlanSummary, (currentPlan) => currentPlan.type);
export const getWillBeCancelledLater = createSelector(selectFeature, (state) => state.willBeCancelledLater);

export const getPlanCode = createSelector(selectFeature, (state) => state.planCode);
export const getSelectedOffer = createSelector(getAllNonDataCapableOffersAsArray, getPlanCode, (offers, planCode) => {
    return offers.find((offer) => offer.planCode === planCode);
});
export const getSelectedPackageName = createSelector(getSelectedOffer, (offer) => offer?.packageName);
export const getOffersMatchingPackageName = createSelector(getAllNonDataCapableOffersAsArray, getSelectedPackageName, (offers, packageName) => {
    return offers.filter((offer) => offer.packageName === packageName);
});

export const getShouldUseCardOnFile = createSelector(selectFeature, (state) => state.useCardOnFile);
export const getPaymentInfo = createSelector(selectFeature, (state) => state.paymentInfo);
export const getReviewOrderDataLoadIsProcessing = createSelector(selectFeature, (state) => state.loadReviewOrderDataIsProcessing);
export const getSubmitChangeSubscriptionDataIsProcessing = createSelector(selectFeature, (state) => state.submitChangeSubscriptionDataIsProcessing);

export const getPlanCodeForSubmission = createSelector(yourCurrentPlan, getPlanCode, (currentPlan, selectedPlanCode) =>
    selectedPlanCode ? selectedPlanCode : currentPlan.planCode
);

export const getCancellationDetails = createSelector(selectFeature, (state) => state.cancellationDetails);
export const getSelectedGridPackageName = createSelector(selectFeature, (state) => state.selectedGridPackageName);

export const getPreSelectedPlanIsEnabled = createSelector(selectFeature, (state) => state.preselectedPlanIsEnabled);
export const getCancelByChatAllowed = createSelector(selectFeature, (state) => state.cancelByChatAllowed);
// TODO: instead of the getIsCanadaMode selector, a property "externalFlagEnabled" should be set the same way as "cancelByChatAllowed"
export const getCancelInterstitalAdobeFlagValue = createSelector(getAdobeFeatureFlags, getIsCanadaMode, (adobeFlag, isCanada) =>
    !isCanada ? adobeFlag?.[AdobeFlagEnum.CancelInterstitial] : { flag: { interstitial: false } }
);

export const getCurrentSubscriptionHasSatellite = createSelector(getCurrentSubscription, (subscription) => !!subscription?.radioService?.radioId);

export const getPlanIsSelectedFromGrid = createSelector(selectFeature, (state) => state.planIsSelectedFromGrid);
export const getIsRefreshAllowed = createSelector(selectFeature, (state) => state.isRefreshAllowed);
