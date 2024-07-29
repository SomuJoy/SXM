import { createSelector } from '@ngrx/store';
import {
    getActiveSubscriptionCards,
    getInactiveSubscriptionCards,
    getInfotainmentPlanIsTrial,
    getIsAudioPlanSelfPay,
    getSelectedSubscriptionAudioFollowOnPlans,
    getSelectedSubscriptionData,
    getSelectedSubscriptionDetailsAudioPlans,
    getSelectedSubscriptionDetailsInfotainmentPlans,
    getSelectedSubscriptionRadioIs360L,
    getShowNewSubscriptionCard,
    getSelectedSubscriptionIsPvip,
    getPackageNameForSelectedSubscription,
    getPlanTypeForSelectedSubscription,
} from './state.selectors';
import { getModifySubscriptionCompatibleOptionsForCancelBySubscriptionId, getModifyAndCancelOptionsBySubscriptionId } from '@de-care/domains/account/state-management';
import {
    getOfferInfoVM,
    getSelectedSubscriptionDetailsAudioPlanData,
    getSelectedSubscriptionDetailsAviationPlanData,
    getSelectedSubscriptionDetailsInfotainmentPlanData,
    getSelectedSubscriptionDetailsMarinePlanData,
} from './subscription-details.selectors';
import { getPvipSubscriptionsFromAccount, selectAccount } from '@de-care/domains/account/state-account';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { getSelectedSubscriptionId, getSkipCancelOverlay } from '@de-care/de-care-use-cases/account/state-my-account';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const getSubscriptionCardsVM = createSelector(
    getActiveSubscriptionCards,
    getInactiveSubscriptionCards,
    getShowNewSubscriptionCard,
    (activeSubscriptionCards, inactiveSubscriptionCards, showNewSubscriptionCard) => ({ activeSubscriptionCards, inactiveSubscriptionCards, showNewSubscriptionCard })
);

export const getSelectedSubscriptionDetailsHeaderData = createSelector(getSelectedSubscriptionData, getSelectedSubscriptionRadioIs360L, (sub, is360L) => {
    let headerType: 'NICKNAME' | 'VEHICLE' | 'RADIO' | 'GENERIC' | 'STREAMING' = 'RADIO';
    if (sub?.type === 'STREAMING_SUBSCRIPTION') {
        headerType = 'STREAMING';
    } else if (sub?.data?.nickname) {
        headerType = 'NICKNAME';
    } else if (sub?.data?.vehicle) {
        headerType = 'VEHICLE';
    } else {
        if (sub?.type === 'MARINE_SUBSCRIPTION' || sub?.type === 'AVIATION_SUBSCRIPTION') {
            headerType = 'GENERIC';
        }
    }
    const vehicleType = sub?.type === 'MARINE_SUBSCRIPTION' ? 'MARINE' : sub?.type === 'AVIATION_SUBSCRIPTION' ? 'AVIATION' : 'CAR';
    return sub
        ? {
              headerType: headerType,
              vehicleType,
              nickname: sub?.data?.nickname,
              yearMakeModelInfo: sub?.data?.vehicle,
              radioId: sub?.data?.radioId,
              platform: sub?.data?.platform,
              is360L,
          }
        : null;
});

export const getModifyAndCancelSubscriptionOptions = (subscriptionId: number | string) =>
    createSelector(getModifyAndCancelOptionsBySubscriptionId(subscriptionId), (option) => option);

export const getDoNotUseModifyOptionRouterLink = createSelector(getSelectedSubscriptionData, (subData) =>
    subData?.type === 'MARINE_SUBSCRIPTION' || subData?.type === 'AVIATION_SUBSCRIPTION' ? true : false
);

export const getHasNonCoterminousPlansWithAudioFollowOn = createSelector(
    getSelectedSubscriptionDetailsAudioPlans,
    getSelectedSubscriptionDetailsInfotainmentPlans,
    getSelectedSubscriptionAudioFollowOnPlans,
    (audioPlans, infotainmentPlans, audioFollowOnPlans) => {
        const isNonCoterminousPlan = audioPlans?.length > 0 && infotainmentPlans?.length > 0 && audioPlans?.[0]?.termLength !== infotainmentPlans?.[0]?.termLength;
        return isNonCoterminousPlan && audioFollowOnPlans?.length > 0;
    }
);

export const getHasSelfPayAudioPlanWithInfotainmentTrial = createSelector(
    getIsAudioPlanSelfPay,
    getInfotainmentPlanIsTrial,
    (isAudioPlanSelfPay, isInfotainmentTrial) => isAudioPlanSelfPay && isInfotainmentTrial
);

export const getToShowSpecialCancelModal = createSelector(
    getHasNonCoterminousPlansWithAudioFollowOn,
    getHasSelfPayAudioPlanWithInfotainmentTrial,
    selectAccount,
    (hasCoTerminousWithAudioFollowOnPlans, hasSelfPayAudioPlanWithInfotainmentTrial, account) => {
        const isPaymentTypeCreditCard = account?.billingSummary.paymentType !== 'invoice';
        const hasPaymentDue = account?.billingSummary?.amountDue > 0;
        return (hasCoTerminousWithAudioFollowOnPlans || hasSelfPayAudioPlanWithInfotainmentTrial) && isPaymentTypeCreditCard && hasPaymentDue;
    }
);

export const getDoNotUseCancelModal = createSelector(getSkipCancelOverlay, (skipOverlay) => skipOverlay);

export const getCancelSubscriptionOptions = (subscriptionId: number | string) =>
    createSelector(getModifySubscriptionCompatibleOptionsForCancelBySubscriptionId(subscriptionId), (options) => {
        const cancelOptions: ('CANCEL' | 'CANCEL_NO_OFFER' | 'CHAT_CANCEL' | 'TRANSFER' | 'CHAT' | 'CALL')[] = [];
        const viewOffer = options?.showViewOffer;
        const transferRadio = options?.showTransferRadio;
        const cancelOnline = options?.showCancelOnline;
        const cancelViaChat = options?.showCancelViaChat;

        if (viewOffer) {
            if (cancelOnline) {
                cancelOptions.push('CANCEL');
            } else if (cancelViaChat) {
                cancelOptions.push('CHAT_CANCEL');
            }
        } else {
            if (cancelOnline) {
                cancelOptions.push('CANCEL_NO_OFFER');
            } else if (cancelViaChat) {
                cancelOptions.push('CHAT');
            }
        }
        transferRadio && cancelOptions.push('TRANSFER');
        cancelOptions.push('CALL');
        return cancelOptions;
    });

export const getSubscriptionDetailsVM = (subscriptionId: string) =>
    createSelector(
        getSelectedSubscriptionDetailsHeaderData,
        getSelectedSubscriptionDetailsAudioPlanData,
        getSelectedSubscriptionDetailsInfotainmentPlanData,
        getSelectedSubscriptionDetailsMarinePlanData,
        getSelectedSubscriptionDetailsAviationPlanData,
        getOfferInfoVM(subscriptionId),
        (headerData, audioData, infotainmentData, marineData, aviationData, offerInfo) => ({ headerData, audioData, infotainmentData, marineData, aviationData, offerInfo })
    );

export const getToShowPvipAlert = createSelector(
    getPvipSubscriptionsFromAccount,
    getSelectedSubscriptionIsPvip,
    (subscriptions, selectedSubscriptionIsPvip) => subscriptions?.length > 1 && selectedSubscriptionIsPvip
);
export const getAccountNumberAndSubscriptionId = createSelector(selectAccount, getSelectedSubscriptionId, (account, subscriptionId) => ({
    accountNumber: account.accountNumber,
    subscriptionId,
}));

export const getPackageDescriptionName = createSelector(
    getPackageNameForSelectedSubscription,
    getPlanTypeForSelectedSubscription,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (packageName, type, packageDescriptions) => {
        const packageDescription = packageDescriptions?.[packageName];
        return packageDescription?.packageOverride?.filter((override) => override?.type === type)?.[0]?.name || packageDescription?.name;
    }
);
