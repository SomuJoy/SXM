import { createSelector } from '@ngrx/store';

import {
    accountPlanTypeIsPromo,
    accountPlanTypeIsTrial,
    getAccountSubscriptions,
    getAccountUsername,
    isPlanAdvantage,
    isPlanAdvantageOrNextOrForwardOrNextBundleOrForwardBundle,
    isPlanEmployee,
    isPlanMilitaryDiscount,
    isPlanNextOrForward,
    isPlanNextOrForwardBundle,
    isPlanPriceChangeMessagingType,
} from '@de-care/domains/account/state-account';
import {
    getPackageNameWithoutAnyPlatform,
    getPackageNameWithOverrideCheck,
    isPlatinumVip,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
} from '@de-care/domains/offers/state-package-descriptions';
import {
    getSelectedSubscriptionAudioFollowOnPlans,
    getSelectedSubscriptionAviationFollowOnPlans,
    getSelectedSubscriptionDetailsAudioPlans,
    getSelectedSubscriptionDetailsAviationPlans,
    getSelectedSubscriptionDetailsInfotainmentPlans,
    getSelectedSubscriptionDetailsMarinePlans,
    getSelectedSubscriptionFromAccount,
    getSelectedSubscriptionInfotainmentFollowOnPlans,
    getSelectedSubscriptionMarineFollowOnPlans,
} from './state.selectors';
import {
    OfferDestinationType,
    DeviceIdentifierType,
    getDoesAccountOnlyHaveOnePvipSubscription,
    getOfferInfoData,
    OfferProfileType,
    getAccountHasOnlyOnePlatinumBundlePlan,
} from '@de-care/de-care-use-cases/account/state-my-account';

export const getSelectedSubscriptionDetailsAudioPlanData = createSelector(
    getSelectedSubscriptionDetailsAudioPlans,
    getSelectedSubscriptionFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedSubscriptionAudioFollowOnPlans,
    getAccountUsername,
    (plans, sub, allPackageDescriptions, followOnPlans, accountUsername) => {
        const firstPlan = plans[0];
        // determining type of plan for presentment purposes
        let planType: 'SELFPAY' | 'TRIAL' | 'PROMO' = 'SELFPAY';
        let hasPromoFollowOn = false; // true if there are any promo followon plans
        let additionalPlanName: 'family' | 'lifetime' | 'demo' | 'military' | 'employee' | 'special' = null;

        const isPvip = isPlatinumVip(firstPlan?.packageName) && !isPlanNextOrForwardBundle(firstPlan?.type);
        // using the channel url for the planLink, this may be explanded to use other links in the future
        const channelUrl = allPackageDescriptions?.[firstPlan?.packageName]?.channelLineUpURL || null;
        if (accountPlanTypeIsTrial(firstPlan?.type)) {
            planType = 'TRIAL';
        } else if (accountPlanTypeIsPromo(firstPlan?.type)) {
            planType = 'PROMO';
        }

        const changedPricePlan = plans.find((plan) => plan.termLength === 1 && isPlanPriceChangeMessagingType(plan.priceChangeMessagingType) && !!plan.priceIncreaseDiff);
        const priceChangeDetails = { showPriceChangeMessage: changedPricePlan ? true : false, priceIncrease: changedPricePlan ? changedPricePlan?.priceIncreaseDiff : 0 };

        //determining additional plan name
        if (firstPlan) {
            if (firstPlan.isLifetime) {
                additionalPlanName = 'lifetime';
            } else if (firstPlan.isFamiliyDiscountApplied) {
                additionalPlanName = 'family';
            } else if (firstPlan.type === 'DEMO') {
                additionalPlanName = 'demo';
            } else if (isPlanMilitaryDiscount(firstPlan.code)) {
                additionalPlanName = 'military';
            } else if (isPlanEmployee(firstPlan.code)) {
                additionalPlanName = 'employee';
            } else if (isPlanNextOrForward(firstPlan.code)) {
                additionalPlanName = 'special';
            }
        }

        const hideAudioDescription = !sub?.radioService || sub?.hasAviationPlan || sub?.hasMarinePlan;
        const followOnPlanData =
            followOnPlans && followOnPlans.length !== 0
                ? followOnPlans.map((plan) => {
                      if (accountPlanTypeIsPromo(plan.type)) {
                          hasPromoFollowOn = true;
                      }
                      return {
                          planName: getPackageNameWithoutAnyPlatform(
                              getPackageNameWithOverrideCheck(allPackageDescriptions?.[plan.packageName], [isPlanAdvantage(plan.code) ? 'ADVANTAGE' : '', plan.type])
                          ),
                          startDate: plan.startDate,
                          endDate: plan.endDate,
                          term: plan.termLength,
                          type: ['forward', 'next'].includes(plan.type?.toLowerCase()) ? 'SELF_PAY' : plan.type,
                          additionalPlanName: plan.isFamiliyDiscountApplied ? 'family' : '',
                          isAdvantage: isPlanAdvantage(plan.code),
                      };
                  })
                : null;
        return firstPlan
            ? {
                  planType,
                  planName: plans?.map((plan) => {
                      // for Forward and Next plans, the strings "FORWARD" and "NEXT" are passed as the plan.type
                      const overrideDetails = allPackageDescriptions?.[plan.packageName]?.packageOverride?.find(
                          (override) => override.type === (isPlanAdvantage(plan.code) ? 'ADVANTAGE' : plan.type)
                      );
                      const planNameFromPackageDescription =
                          isPlanAdvantageOrNextOrForwardOrNextBundleOrForwardBundle(plan.code) && overrideDetails && overrideDetails?.name
                              ? overrideDetails.name
                              : allPackageDescriptions?.[plan.packageName]?.name;
                      return getPackageNameWithoutAnyPlatform(planNameFromPackageDescription);
                  }),
                  term: firstPlan.termLength,
                  endDate: firstPlan.endDate,
                  planUrl: channelUrl,
                  username: sub?.streamingService?.userName,
                  followOnPlans: followOnPlanData,
                  hasPromoFollowOn,
                  isPvip,
                  hasStreaming: sub?.streamingService?.status === 'Active',
                  hideAudioDescription,
                  isStreamingServiceSameAsAccountUsername: sub?.streamingService?.userName === accountUsername ? true : false,
                  subscriptionId: sub?.id,
                  additionalPlanName,
                  renewalDate: firstPlan.nextCycleOn,
                  isAdvantage: isPlanAdvantage(firstPlan.code),
                  priceChangeDetails,
                  redirectToPhx: sub?.isPrimary ? true : false,
              }
            : null;
    }
);

export const getSelectedSubscriptionDetailsInfotainmentPlanData = createSelector(
    getSelectedSubscriptionDetailsInfotainmentPlans,
    getSelectedSubscriptionFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedSubscriptionInfotainmentFollowOnPlans,
    (plans, sub, allPackageDescriptions, followOnPlans) => {
        const firstPlan = plans[0];
        // determining type of plan for presentment purposes
        let planType: 'SELFPAY' | 'TRIAL' | 'PROMO' = 'SELFPAY';
        let hasPromoFollowOn = false; // true if there are any promo followon plans
        // using the channel url for the planLink, this may be explanded to use other links in the future
        const channelUrl = allPackageDescriptions?.[firstPlan?.packageName]?.channelLineUpURL || null;
        if (accountPlanTypeIsTrial(firstPlan?.type)) {
            planType = 'TRIAL';
        } else if (accountPlanTypeIsPromo(firstPlan?.type)) {
            planType = 'PROMO';
        }

        const changedPricePlan = plans.find((plan) => plan.termLength === 1 && isPlanPriceChangeMessagingType(plan.priceChangeMessagingType) && !!plan.priceIncreaseDiff);
        const priceChangeDetails = { showPriceChangeMessage: changedPricePlan ? true : false, priceIncrease: changedPricePlan ? changedPricePlan?.priceIncreaseDiff : 0 };

        const followOnPlanData =
            followOnPlans && followOnPlans.length !== 0
                ? followOnPlans.map((plan) => {
                      if (accountPlanTypeIsPromo(plan.type)) {
                          hasPromoFollowOn = true;
                      }
                      return {
                          planName: getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name),
                          startDate: plan.startDate,
                          endDate: plan.endDate,
                          term: plan.termLength,
                          type: plan.type,
                      };
                  })
                : null;
        return firstPlan
            ? {
                  planType,
                  planName: plans?.map((plan) => getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name)),
                  term: firstPlan.termLength,
                  endDate: firstPlan.endDate,
                  planUrl: channelUrl,
                  username: sub?.streamingService?.userName,
                  followOnPlans: followOnPlanData,
                  hasPromoFollowOn,
                  priceChangeDetails,
              }
            : null;
    }
);

export const getSelectedSubscriptionDetailsMarinePlanData = createSelector(
    getSelectedSubscriptionDetailsMarinePlans,
    getSelectedSubscriptionFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedSubscriptionMarineFollowOnPlans,
    getAccountUsername,
    (plans, sub, allPackageDescriptions, followOnPlans, accountUsername) => {
        const firstPlan = plans[0];
        // determining type of plan for presentment purposes
        let planType: 'SELFPAY' | 'TRIAL' | 'PROMO' = 'SELFPAY';
        let hasPromoFollowOn = false; // true if there are any promo followon plans
        // using the channel url for the planLink, this may be explanded to use other links in the future
        const channelUrl = allPackageDescriptions?.[firstPlan?.packageName]?.channelLineUpURL || null;
        if (accountPlanTypeIsTrial(firstPlan?.type)) {
            planType = 'TRIAL';
        } else if (accountPlanTypeIsPromo(firstPlan?.type)) {
            planType = 'PROMO';
        }

        const changedPricePlan = plans.find((plan) => plan.termLength === 1 && isPlanPriceChangeMessagingType(plan.priceChangeMessagingType) && !!plan.priceIncreaseDiff);
        const priceChangeDetails = { showPriceChangeMessage: changedPricePlan ? true : false, priceIncrease: changedPricePlan ? changedPricePlan?.priceIncreaseDiff : 0 };

        const followOnPlanData =
            followOnPlans && followOnPlans.length !== 0
                ? followOnPlans.map((plan) => {
                      if (accountPlanTypeIsPromo(plan.type)) {
                          hasPromoFollowOn = true;
                      }
                      return {
                          planName: getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name),
                          startDate: plan.startDate,
                          endDate: plan.endDate,
                          term: plan.termLength,
                          type: plan.type,
                      };
                  })
                : null;
        return firstPlan
            ? {
                  planType,
                  planName: plans?.map((plan) => getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name)),
                  term: firstPlan.termLength,
                  endDate: firstPlan.endDate,
                  planUrl: channelUrl,
                  username: sub?.streamingService?.userName,
                  followOnPlans: followOnPlanData,
                  hasPromoFollowOn,
                  hasStreaming: sub?.streamingService?.status === 'Active',
                  isStreamingServiceSameAsAccountUsername: sub?.streamingService?.userName === accountUsername ? true : false,
                  subscriptionId: sub?.id,
                  priceChangeDetails,
                  redirectToPhx: sub?.isPrimary ? true : false,
              }
            : null;
    }
);

export const getSelectedSubscriptionDetailsAviationPlanData = createSelector(
    getSelectedSubscriptionDetailsAviationPlans,
    getSelectedSubscriptionFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getSelectedSubscriptionAviationFollowOnPlans,
    (plans, sub, allPackageDescriptions, followOnPlans) => {
        const firstPlan = plans[0];
        // determining type of plan for presentment purposes
        let planType: 'SELFPAY' | 'TRIAL' | 'PROMO' = 'SELFPAY';
        let hasPromoFollowOn = false; // true if there are any promo followon plans
        // using the channel url for the planLink, this may be explanded to use other links in the future
        const channelUrl = allPackageDescriptions?.[firstPlan?.packageName]?.channelLineUpURL || null;
        if (accountPlanTypeIsTrial(firstPlan?.type)) {
            planType = 'TRIAL';
        } else if (accountPlanTypeIsPromo(firstPlan?.type)) {
            planType = 'PROMO';
        }

        const changedPricePlan = plans.find((plan) => plan.termLength === 1 && isPlanPriceChangeMessagingType(plan.priceChangeMessagingType) && !!plan.priceIncreaseDiff);
        const priceChangeDetails = { showPriceChangeMessage: changedPricePlan ? true : false, priceIncrease: changedPricePlan ? changedPricePlan?.priceIncreaseDiff : 0 };

        const followOnPlanData =
            followOnPlans && followOnPlans.length !== 0
                ? followOnPlans.map((plan) => {
                      if (accountPlanTypeIsPromo(plan.type)) {
                          hasPromoFollowOn = true;
                      }
                      return {
                          planName: getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name),
                          startDate: plan.startDate,
                          endDate: plan.endDate,
                          term: plan.termLength,
                          type: plan.type,
                      };
                  })
                : null;
        return firstPlan
            ? {
                  planType,
                  planName: plans?.map((plan) => getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name)),
                  term: firstPlan.termLength,
                  endDate: firstPlan.endDate,
                  planUrl: channelUrl,
                  username: sub?.streamingService?.userName,
                  followOnPlans: followOnPlanData,
                  hasPromoFollowOn,
                  priceChangeDetails,
              }
            : null;
    }
);

export const getOfferInfoDataBySubscriptionId = (subscriptionId: string) =>
    createSelector(
        getAccountSubscriptions,
        getDoesAccountOnlyHaveOnePvipSubscription,
        getAccountHasOnlyOnePlatinumBundlePlan,
        (subscriptions, onlyOnePvip, onlyOnePlatinumBundle) => {
            // TODO: DASHBOARD_CMS: bring in selectOfferInfosForCurrentLocaleMappedByPlanCode and "offer plancode"
            const subscription = subscriptions?.find((subscription) => subscription.id === subscriptionId);
            const { plans, radioService, nickname, status: subscriptionStatus, followonPlans } = subscription || {};
            const { type: planType, packageName, code: planCode, termLength: planTermLength, isLifetime, capabilities: planCapabilities } = plans?.[0] || {};
            const { devicePromoCode, vehicleInfo } = radioService || {};
            const radioId = radioService?.radioId;
            let offerInfoData: { destination: OfferDestinationType; offerProfile: OfferProfileType; overwriteCopy: boolean } = {
                destination: null, // where the offer CTA will navigate to
                offerProfile: null, // profile that determines what type of offer is shown
                overwriteCopy: true, // whether or not to overwrite with copy in translate file (true for all until cms integration)
            };
            let deviceData: { type: DeviceIdentifierType; identifier: string } = { type: 'DEFAULT', identifier: '' }; // for dynamic device data in offer card
            // TODO: DASHBOARD_CMS: remove overwriteCopy = true for profiles that have offers coming from cms

            if (vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model) {
                deviceData = { type: 'YMM', identifier: `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}` };
            } else if (nickname) {
                deviceData = { type: 'NICKNAME', identifier: nickname };
            }

            offerInfoData = getOfferInfoData(
                planType,
                packageName,
                planCode,
                subscriptionStatus,
                devicePromoCode,
                isLifetime,
                followonPlans?.length > 0,
                planTermLength,
                onlyOnePvip,
                onlyOnePlatinumBundle,
                planCapabilities
            );

            // TODO: DASHBOARD_CMS: eventually add ...offersInfo[planCode] to return
            return { ...offerInfoData, subscriptionId, radioId, deviceData };
        }
    );

export const getOfferInfoVM = (subscriptionId: string) =>
    createSelector(getOfferInfoDataBySubscriptionId(subscriptionId), (offerInfo) => {
        if (!offerInfo?.destination) {
            return null;
        } else {
            // TODO: DASHBOARD_CMS: add copy from offerInfo into title, subtitle and legalCopy props
            return {
                title: '',
                subtitle: '',
                legalCopy: '',
                ...offerInfo,
            };
        }
    });
