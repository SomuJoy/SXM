import {
    accountPlanTypeIsTrial,
    getAccountBillingSummary,
    getAccountFirstSubscriptionSubscriptionID,
    getAccountSubscriptions,
    getAccountUsername,
    getClosedDevicesFromAccount,
    isPlanAviation,
    isPlanMarine,
    getAccountFirstSubscriptionFirstPlan,
    getAccountFirstSubscriptionRadioService,
    getFirstClosedDeviceFromAccount,
    getAccountFirstSubscription,
    getDoesAccountHaveAtLeastOneTrial,
    getDoesAccountHaveAtLeastOneSelfPayOrPromo,
    isPlanAdvantage,
} from '@de-care/domains/account/state-account';
import {
    getPackageNameWithoutAnyPlatform,
    getPackageNameWithOverrideCheck,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
} from '@de-care/domains/offers/state-package-descriptions';
import { createSelector } from '@ngrx/store';
import { SubscriptionCardComponent } from './interface';
import {
    OfferDestinationType,
    OfferProfileType,
    DeviceIdentifierType,
    getOfferInfoData,
    getDoesAccountOnlyHaveOnePvipSubscription,
    getAccountHasOnlyOnePlatinumBundlePlan,
} from '@de-care/de-care-use-cases/account/state-my-account';
import { selectFeatureState } from './reducer';
import { getBillingData } from '@de-care/de-care-use-cases/account/state-common';
export { getBillingData } from '@de-care/de-care-use-cases/account/state-common';

export const getAccountHasOnlyTrialPlans = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.every((sub) => sub.plans?.every((plan) => plan.type === 'TRIAL'))
);

export const getAccountTrialPlanNearestEndDate = createSelector(getAccountSubscriptions, (subscriptions) => {
    const endDates = [];
    for (const sub of subscriptions) {
        const trialPlan = sub?.plans.find((plan) => plan.type === 'TRIAL');
        if (trialPlan) {
            endDates.push(new Date(trialPlan.endDate).getTime());
        }
    }
    endDates.sort((a, b) => b.datetime - a.datetime);
    return endDates[0];
});

export const getAccountHasAnyTrialPlansWithFollowon = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.some((sub) => sub.plans?.every((plan) => plan.type === 'TRIAL') && sub.followonPlans?.length > 0)
);

export const getAccountTrialPlansDetails = createSelector(
    getAccountHasAnyTrialPlansWithFollowon,
    getAccountTrialPlanNearestEndDate,
    (hasAnyTrialPlansWithFollowon, trialPlanNearestEndDate) => ({ hasAnyTrialPlansWithFollowon, trialPlanNearestEndDate: trialPlanNearestEndDate })
);

export const getAccountHasOnlyInactiveServiceDueToNonPay = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.every((sub) => sub.hasInactiveServiceDueToNonPay)
);

export const getAccountHasAtleastOneInactiveServiceDueToNonPay = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.some((sub) => sub.hasInactiveServiceDueToNonPay)
);

export const getAccountHasAtLeastOneInactiveSubscription = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.some((sub) => sub.status === 'Inactive')
);

export const getAccountHasAtLeastOneActiveSubscription = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions.length > 0 && subscriptions.some((sub) => sub.status === 'Active')
);

export const getAccountHasOnlySeasonallySuspendedOrClosedSubscriptions = createSelector(
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    (subscriptions, closedDevices) =>
        (subscriptions?.length > 0 &&
            subscriptions?.every((sub) => sub.status === 'Inactive' && sub.hasInactiveServiceDueToSuspension && !sub.hasInactiveServiceDueToNonPay)) ||
        (subscriptions?.length === 0 && closedDevices?.length > 0)
);

export const getShowNewSubscriptionCard = createSelector(
    getAccountHasOnlySeasonallySuspendedOrClosedSubscriptions,
    (hasOnlySeasonallySuspendedOrClosedSubscriptions) => hasOnlySeasonallySuspendedOrClosedSubscriptions
);

export const getShowBillingModule = createSelector(
    getClosedDevicesFromAccount,
    getAccountHasOnlyInactiveServiceDueToNonPay,
    getAccountBillingSummary,
    getAccountHasAtLeastOneInactiveSubscription,
    getAccountHasAtLeastOneActiveSubscription,
    (closedDevices, hasInactiveServiceDueToNonPay, billingSummary, hasAtleastOneInactiveSub, hasAtleastOneActiveSub) => {
        const amountDue =
            billingSummary?.amountDue > 0
                ? billingSummary.amountDue
                : billingSummary?.amountDue + billingSummary?.nextPaymentAmount > 0
                ? billingSummary?.amountDue + billingSummary?.nextPaymentAmount
                : 0;
        // no active subs && at least one inactive/closed subs && no balance due on the account && not non pay
        if (!hasAtleastOneActiveSub && (hasAtleastOneInactiveSub || closedDevices?.length > 0) && amountDue === 0 && !hasInactiveServiceDueToNonPay) {
            // hide billing
            return false;
        } else {
            // show billing
            return true;
        }
    }
);

export const getSubscriptionData = createSelector(
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getAccountUsername,
    (subscriptions, closedDevices, allPackageDescriptions, accountUsername) => {
        const activeArray = subscriptions?.map((sub, index) => {
            const { radioService, plans, streamingService } = sub || {};
            const { vehicleInfo } = radioService || {};
            const isTrial = accountPlanTypeIsTrial(plans?.[0].type);
            let type: SubscriptionCardComponent;
            if (sub.status === 'Active') {
                type = 'ACTIVE_SUBSCRIPTION';
                if (sub?.hasMarinePlan) {
                    type = 'MARINE_SUBSCRIPTION';
                } else if (sub?.hasAviationPlan) {
                    type = 'AVIATION_SUBSCRIPTION';
                } else if (radioService === null) {
                    // streaming only
                    type = 'STREAMING_SUBSCRIPTION';
                }
            }
            if (sub.status === 'Inactive') {
                if (sub.hasInactiveServiceDueToSuspension) {
                    type = 'INACTIVE_SUBSCRIPTION_DUE_TO_SEASONAL_SUSPENSION';
                } else {
                    type = 'INACTIVE_SUBSCRIPTION';
                }
                if (radioService === null) {
                    if (sub.hasInactiveServiceDueToSuspension) {
                        type = 'INACTIVE_STREAMING_SUBSCRIPTION_DUE_TO_SEASONAL_SUSPENSION';
                    } else {
                        type = 'INACTIVE_STREAMING_SUBSCRIPTION';
                    }
                }
            }

            const tempPlans = JSON.parse(JSON.stringify(plans));
            tempPlans.sort((firstPlan, secondPlan) =>
                isPlanMarine(secondPlan.capabilities) || isPlanAviation(secondPlan.capabilities)
                    ? 1
                    : isPlanMarine(firstPlan.capabilities) || isPlanAviation(firstPlan.capabilities)
                    ? -1
                    : 0
            );

            return {
                data: {
                    nickname: sub?.nickname,
                    vehicle: vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}` : null,
                    radioId: radioService?.radioId,
                    plans: tempPlans?.map((plan) =>
                        getPackageNameWithoutAnyPlatform(
                            getPackageNameWithOverrideCheck(allPackageDescriptions?.[plan.packageName], [isPlanAdvantage(plan.code) ? 'ADVANTAGE' : '', plan.type])
                        )
                    ),
                    username: streamingService?.userName,
                    id: sub?.id,
                    index: index,
                    isTrial,
                    streamingServiceStatus: sub?.streamingService ? (sub?.streamingService.status === 'Active' ? true : false) : null,
                    isStreamingServiceSameAsAccountUsername: sub?.streamingService?.userName === accountUsername ? true : false,
                    isInactiveDueToSuspensionOrNonPay: sub?.hasInactiveServiceDueToSuspension || sub?.hasInactiveServiceDueToNonPay,
                    isInactiveDueToNonPay: sub?.hasInactiveServiceDueToNonPay,
                    vehicleType: sub?.hasMarinePlan ? 'MARINE' : sub?.hasAviationPlan ? 'AVIATION' : 'CAR',
                    redirectToPhx: sub?.isPrimary ? true : false,
                },
                type,
            };
        });
        const closedArray = closedDevices?.map((closed, index) => {
            const { vehicleInfo } = closed || {};
            return {
                type: 'INACTIVE_SUBSCRIPTION' as SubscriptionCardComponent,
                data: {
                    nickname: closed?.nickname,
                    vehicle: vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}` : null,
                    radioId: closed?.radioId,
                    plans: null,
                    username: null,
                    id: closed?.subscription?.id,
                    index: activeArray?.length ?? 0 + index,
                    isTrial: false,
                    streamingServiceStatus: closed?.subscription?.streamingService ? (closed?.subscription?.streamingService.status === 'Active' ? true : false) : null,
                    isStreamingServiceSameAsAccountUsername: closed?.subscription?.streamingService?.userName === accountUsername ? true : false,
                    isInactiveDueToSuspensionOrNonPay: closed?.subscription?.hasInactiveServiceDueToSuspension || closed?.subscription?.hasInactiveServiceDueToNonPay,
                    isInactiveDueToNonPay: closed?.subscription?.hasInactiveServiceDueToNonPay,
                    vehicleType: closed?.subscription?.hasMarinePlan ? 'MARINE' : closed?.subscription?.hasAviationPlan ? 'AVIATION' : 'CAR',
                },
            };
        });
        return closedArray ? [...activeArray, ...closedArray] : activeArray;
    }
);

export const getOfferInfoDataForFirstSubscription = createSelector(
    getAccountFirstSubscription,
    getAccountFirstSubscriptionFirstPlan,
    getAccountFirstSubscriptionSubscriptionID,
    getAccountFirstSubscriptionRadioService,
    getDoesAccountOnlyHaveOnePvipSubscription,
    getAccountHasOnlyOnePlatinumBundlePlan,
    getShowBillingModule,
    getFirstClosedDeviceFromAccount,
    (subscription, plan, subscriptionId, radioService, onlyOnePvip, onlyOnePlatinumBundle, showBillingModule, closedDevice) => {
        // TODO: DASHBOARD_CMS: bring in selectOfferInfosForCurrentLocaleMappedByPlanCode and "offer plancode"
        const { type: planType, packageName, code: planCode, termLength: planTermLength, isLifetime, capabilities: planCapabilities } = plan || {};
        const { devicePromoCode, vehicleInfo } = radioService || {};
        const { status: subscriptionStatus, nickname, followonPlans } = subscription || {};
        let radioId = radioService?.radioId;
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

        if (!plan) {
            offerInfoData.destination = 'SHOP';
            offerInfoData.offerProfile = 'DEFAULT_FREE_RADIO';
            offerInfoData.overwriteCopy = true;
            if (!showBillingModule) {
                // if there is no billing module and no active sub, then it is a closed radio scenario
                offerInfoData.destination = 'ACTIVATE';
                offerInfoData.offerProfile = 'INACTIVE';
                offerInfoData.overwriteCopy = true;
                radioId = closedDevice?.radioId;
            }
        }

        // TODO: DASHBOARD_CMS: eventually add ...offersInfo[planCode] to return
        return { ...offerInfoData, subscriptionId, radioId, deviceData };
    }
);

export const getBillingShowOfferCard = createSelector(getAccountHasOnlyTrialPlans, getOfferInfoDataForFirstSubscription, (isOnlyTrial, offerInfoData) =>
    isOnlyTrial || !offerInfoData?.destination ? false : true
);

export const getSubscriptionShowOfferCard = createSelector(getAccountHasOnlyTrialPlans, getOfferInfoDataForFirstSubscription, (isOnlyTrial, offerInfoData) =>
    isOnlyTrial && offerInfoData?.destination ? true : false
);

export const getShowActivateOfferCardAfterSubscriptions = createSelector(getShowBillingModule, getOfferInfoDataForFirstSubscription, (showBillingModule, offerInfoData) =>
    !showBillingModule && offerInfoData?.destination ? true : false
);

export const getFirstSubscriptionOfferInfoVM = createSelector(getOfferInfoDataForFirstSubscription, (offerInfo) => {
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

export const getSections = createSelector(getAccountHasOnlyTrialPlans, getShowBillingModule, (isOnlyTrial, showBilling) => {
    return isOnlyTrial
        ? ['SUBSCRIPTIONS', 'BILLING', 'FAQ', 'TRENDING']
        : showBilling
        ? ['BILLING', 'SUBSCRIPTIONS', 'FAQ', 'TRENDING']
        : ['SUBSCRIPTIONS', 'FAQ', 'TRENDING'];
});

export const getBillingCards = createSelector(getBillingData, getBillingShowOfferCard, getFirstSubscriptionOfferInfoVM, (billingData, showOfferCard, offerInfoVM) => {
    const cardArray = [];
    const isFullWidth = billingData?.type === 'BILLING_WITH_TRIALER_NO_PAYMENT_DUE_WITH_FOLLOWON';
    cardArray.push({ ...billingData, span: { medium: isFullWidth ? 2 : 1, large: isFullWidth ? 2 : 1 }, offerInfoVM: null });
    if (showOfferCard) {
        cardArray.push({ type: 'MARKETING', data: null, offerInfoVM, span: { medium: 1, large: 1 } });
    }
    return cardArray;
});

export const getSubscriptionCards = createSelector(
    getSubscriptionData,
    getSubscriptionShowOfferCard,
    getFirstSubscriptionOfferInfoVM,
    getShowActivateOfferCardAfterSubscriptions,
    getShowNewSubscriptionCard,
    (subData, showOfferCard, offerInfoVM, showActivateCardAfterSubscriptions, showNewSubscriptionCard) => {
        const endSlice = subData?.length > 2 ? 2 : subData?.length;
        const cardArray = subData.slice(0, endSlice).map((sub) => {
            return { ...sub, span: { medium: 1, large: 1 }, offerInfoVM: null };
        });

        if (showOfferCard) {
            cardArray.push({ type: 'MARKETING', data: null, offerInfoVM, span: { medium: endSlice === 1 ? 1 : 2, large: endSlice === 1 ? 2 : 3 } });
        } else {
            // the offer card only gets shown in the subscription section if the only active subs are trials and trials don't get the add subscription card,
            // so both cards will never be shown together (unless the offer is the activate card, which shows for only closed radios)
            cardArray.push({
                type: showNewSubscriptionCard ? 'NEW_SUBSCRIPTION' : 'ADD_SUBSCRIPTION',
                data: null,
                offerInfoVM: null,
                span: { medium: endSlice === 1 ? 1 : 2, large: 1 },
            });

            if (showActivateCardAfterSubscriptions) {
                cardArray.push({ type: 'MARKETING', data: null, offerInfoVM, span: { medium: 2, large: 3 } });
            }
        }

        return cardArray;
    }
);

export const getSubscriptionHeaderSpan = createSelector(getSubscriptionCards, (subscriptionCards) => {
    return { medium: 2, large: subscriptionCards?.length > 2 || subscriptionCards?.some((card) => card.type === 'MARKETING') ? 3 : 2 };
});

export const getBillingHeaderSpan = createSelector(getBillingData, (billingData) => {
    const isFullWidth = billingData?.type === 'BILLING_WITH_TRIALER_NO_PAYMENT_DUE_WITH_FOLLOWON';
    return { medium: isFullWidth ? 2 : 1, large: isFullWidth ? 2 : 1 };
});

export const getFaqCardType = createSelector(getDoesAccountHaveAtLeastOneTrial, getDoesAccountHaveAtLeastOneSelfPayOrPromo, (hasTrial, hasSelfPayOrPromo) => {
    if (hasTrial && !hasSelfPayOrPromo) {
        return 'TRIAL_ONLY';
    } else if (!hasTrial && hasSelfPayOrPromo) {
        return 'SELF_PAY';
    } else {
        // default case for trial and self pay, and also no active subscriptions
        return 'TRIAL_SELF_PAY';
    }
});

export const selectHideTrending = createSelector(selectFeatureState, (state) => state.hideTrending);
