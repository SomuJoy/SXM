import { getSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';
import {
    accountPlanTypeIsSelfPay,
    accountPlanTypeIsTrial,
    getAccountEmail,
    getAccountSubscriptions,
    getAccountUsername,
    getClosedDevicesFromAccount,
    isPlanAdvantage,
    isPlanAviation,
    isPlanMarine,
} from '@de-care/domains/account/state-account';
import { getPlatformFromPackageName } from '@de-care/domains/offers/state-offers';
import {
    getPackageNameWithoutAnyPlatform,
    getPackageNameWithOverrideCheck,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
} from '@de-care/domains/offers/state-package-descriptions';
import { createSelector } from '@ngrx/store';
import { SubscriptionCardComponent } from '../interface';

export const getSubscriptionData = createSelector(
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (subscriptions, closedDevices, allPackageDescriptions) => {
        const activeArray = subscriptions?.map((sub, index) => {
            const { radioService, plans, streamingService } = sub || {};
            const { vehicleInfo } = radioService || {};
            const platform = getPlatformFromPackageName(plans?.[0]?.packageName);
            const isTrial = accountPlanTypeIsTrial(plans?.[0]?.type);
            let type: SubscriptionCardComponent;
            if (sub.status === 'Active') {
                type = 'ACTIVE_SUBSCRIPTION';
                if (sub?.hasMarinePlan) {
                    type = 'MARINE_SUBSCRIPTION';
                } else if (sub?.hasAviationPlan) {
                    type = 'AVIATION_SUBSCRIPTION';
                } else if (radioService === null) {
                    type = 'STREAMING_SUBSCRIPTION';
                }
            }
            return {
                data: {
                    nickname: sub?.nickname,
                    vehicle: vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}` : null,
                    radioId: radioService?.radioId,
                    plans: plans?.map((plan) => getPackageNameWithoutAnyPlatform(allPackageDescriptions?.[plan.packageName]?.name)),
                    username: streamingService?.userName,
                    id: sub?.id,
                    index: index,
                    platform,
                    isTrial,
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
                    id: null,
                    index: activeArray?.length ?? 0 + index,
                    platform: null,
                    isTrial: false,
                },
            };
        });
        return closedArray ? [...activeArray, ...closedArray] : activeArray;
    }
);

export const getActiveSubscriptionCards = createSelector(
    getAccountSubscriptions,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getAccountEmail,
    getAccountUsername,
    (subscriptions, allPackageDescriptions, accountEmail, accountUsername) => {
        const subscriptionCards = subscriptions
            .filter((subscription) => subscription.status === 'Active')
            .map((sub, index) => {
                const { radioService, plans, streamingService } = sub || {};
                const vehicleInfo = radioService?.vehicleInfo || {};
                const isTrial = accountPlanTypeIsTrial(plans?.[0].type);
                let type: SubscriptionCardComponent = 'ACTIVE_SUBSCRIPTION';

                if (sub?.hasMarinePlan) {
                    type = 'MARINE_SUBSCRIPTION';
                } else if (sub?.hasAviationPlan) {
                    type = 'AVIATION_SUBSCRIPTION';
                } else if (radioService === null) {
                    // streaming only
                    type = 'STREAMING_SUBSCRIPTION';
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
                    type: type,
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
                        email: accountEmail,
                        id: sub?.id,
                        index: index,
                        isTrial,
                        streamingServiceStatus: sub?.streamingService ? (sub?.streamingService?.status === 'Active' ? true : false) : null,
                        isStreamingServiceSameAsAccountUsername: sub?.streamingService?.userName === accountUsername ? true : false,
                        isInactiveDueToSuspensionOrNonPay: sub?.hasInactiveServiceDueToSuspension || sub?.hasInactiveServiceDueToNonPay,
                        isInactiveDueToNonPay: sub?.hasInactiveServiceDueToNonPay,
                        vehicleType: sub?.hasMarinePlan ? 'MARINE' : sub?.hasAviationPlan ? 'AVIATION' : 'CAR',
                        redirectToPhx: sub?.isPrimary ? true : false,
                    },
                    span: { medium: 1, large: 1 },
                };
            });

        const dontSeeCard: any = { type: 'DONT_SEE_YOUR_SUBSCRIPTION', span: { medium: 1, large: 1 } };
        return (subscriptionCards || []).concat([dontSeeCard]);
    }
);

export const getInactiveSubscriptionCards = createSelector(
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    getAccountUsername,
    (subscriptions, closedDevices, accountUsername) => {
        const activeSubscriptions = (subscriptions || []).filter((sub) => sub.status === 'Active');
        const suspendedSubscriptionCards = (subscriptions || [])
            ?.filter((sub) => sub.status === 'Inactive')
            .map((sub, index) => {
                const { radioService, streamingService } = sub || {};
                const vehicleInfo = radioService?.vehicleInfo || {};
                let type = '';
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
                return {
                    type: type,
                    data: {
                        nickname: sub?.nickname,
                        vehicle: vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}` : null,
                        radioId: radioService?.radioId,
                        plans: null,
                        username: streamingService?.userName,
                        id: sub?.id,
                        index: activeSubscriptions.length + index,
                        streamingServiceStatus: sub?.streamingService ? (sub?.streamingService?.status === 'Active' ? true : false) : null,
                        isStreamingServiceSameAsAccountUsername: sub?.streamingService?.userName === accountUsername ? true : false,
                        isInactiveDueToSuspensionOrNonPay: sub?.hasInactiveServiceDueToSuspension || sub?.hasInactiveServiceDueToNonPay,
                        isInactiveDueToNonPay: sub?.hasInactiveServiceDueToNonPay,
                        vehicleType: sub?.hasMarinePlan ? 'MARINE' : sub?.hasAviationPlan ? 'AVIATION' : 'CAR',
                    },
                    span: { medium: 1, large: 1 },
                };
            });
        const subscriptionCards = closedDevices?.map((closedDevice, index) => {
            const { vehicleInfo } = closedDevice;
            return {
                type: 'INACTIVE_SUBSCRIPTION',
                data: {
                    nickname: closedDevice?.nickname,
                    vehicle: vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo?.year} ${vehicleInfo?.make} ${vehicleInfo?.model}` : null,
                    radioId: closedDevice?.radioId,
                    plans: null,
                    username: null,
                    id: closedDevice?.subscription?.id,
                    index: activeSubscriptions.length + suspendedSubscriptionCards.length + index,
                    streamingServiceStatus: closedDevice?.subscription?.streamingService
                        ? closedDevice?.subscription?.streamingService?.status === 'Active'
                            ? true
                            : false
                        : null,
                    isStreamingServiceSameAsAccountUsername: closedDevice?.subscription?.streamingService?.userName === accountUsername ? true : false,
                    isInactiveDueToSuspensionOrNonPay:
                        closedDevice?.subscription?.hasInactiveServiceDueToSuspension || closedDevice?.subscription?.hasInactiveServiceDueToNonPay,
                    isInactiveDueToNonPay: closedDevice?.subscription?.hasInactiveServiceDueToNonPay,
                    vehicleType: closedDevice?.subscription?.hasMarinePlan ? 'MARINE' : closedDevice?.subscription?.hasAviationPlan ? 'AVIATION' : 'CAR',
                },
                span: { medium: 1, large: 1 },
            };
        });
        return subscriptionCards ? suspendedSubscriptionCards.concat(subscriptionCards) : suspendedSubscriptionCards.length > 0 ? suspendedSubscriptionCards : null;
    }
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

export const getSelectedSubscriptionData = createSelector(getSubscriptionData, getSelectedSubscriptionId, (subscriptionData, id) =>
    subscriptionData?.find((subscription) => subscription.data?.id === id)
);
export const getSelectedSubscriptionFromAccount = createSelector(getAccountSubscriptions, getSelectedSubscriptionId, (subscriptions, id) =>
    subscriptions?.find((subscription) => subscription.id === id)
);
// finds the plans that are not dataCapable and not marine or aviation
export const getSelectedSubscriptionDetailsAudioPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.plans?.filter((plan) => plan.dataCapable === false && !isPlanMarine(plan.capabilities) && !isPlanAviation(plan.capabilities))
);
// finds the plans that are dataCapable and not marine or aviation
export const getSelectedSubscriptionDetailsInfotainmentPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.plans?.filter((plan) => plan.dataCapable === true && !isPlanMarine(plan.capabilities) && !isPlanAviation(plan.capabilities))
);
export const getSelectedSubscriptionDetailsMarinePlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.plans?.filter((plan) => isPlanMarine(plan.capabilities))
);
export const getSelectedSubscriptionDetailsAviationPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.plans?.filter((plan) => isPlanAviation(plan.capabilities))
);
export const getSelectedSubscriptionAudioFollowOnPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.followonPlans?.filter((plan) => plan.dataCapable === false && !isPlanMarine(plan.capabilities) && !isPlanAviation(plan.capabilities))
);
export const getSelectedSubscriptionInfotainmentFollowOnPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.followonPlans?.filter((plan) => plan.dataCapable === true && !isPlanMarine(plan.capabilities) && !isPlanAviation(plan.capabilities))
);
export const getSelectedSubscriptionMarineFollowOnPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.followonPlans?.filter((plan) => isPlanMarine(plan.capabilities))
);
export const getSelectedSubscriptionAviationFollowOnPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) =>
    sub?.followonPlans?.filter((plan) => isPlanAviation(plan.capabilities))
);

export const getSelectedSubscriptionPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) => sub?.plans);
export const getSelectedSubscriptionIsPvip = createSelector(
    getSelectedSubscriptionPlans,
    (plans) => plans?.map((plan) => plan.packageName)?.filter((packageName) => packageName?.includes('_VIP')).length > 0
);
export const getPackageNameForSelectedSubscription = createSelector(getSelectedSubscriptionPlans, (plans) => plans[0]?.packageName);
export const getPlanTypeForSelectedSubscription = createSelector(getSelectedSubscriptionPlans, (plans) => plans[0]?.type);

export const getSelectedSubscriptionTypeInfo = createSelector(getSelectedSubscriptionFromAccount, (sub) => ({
    active: sub?.status === 'Active',
    isStreamingOnly: sub?.status === 'Active' && sub?.radioService === null,
}));

export const getSelectedSubscriptionRadioIs360L = createSelector(getSelectedSubscriptionFromAccount, (sub) => sub?.radioService?.is360LCapable);
export const getSelectedSubscriptionIsTrial = createSelector(getSelectedSubscriptionFromAccount, (sub) => accountPlanTypeIsTrial(sub?.plans?.[0]?.type));
export const getIsAudioPlanSelfPay = createSelector(getSelectedSubscriptionDetailsAudioPlans, (plans) => accountPlanTypeIsSelfPay(plans?.[0]?.type));
export const getInfotainmentPlanIsTrial = createSelector(getSelectedSubscriptionDetailsInfotainmentPlans, (plans) => accountPlanTypeIsTrial(plans?.[0]?.type));
export const getSelectedSubscriptionHasFollowOnPlans = createSelector(getSelectedSubscriptionFromAccount, (sub) => sub?.followonPlans && sub?.followonPlans?.length > 0);
