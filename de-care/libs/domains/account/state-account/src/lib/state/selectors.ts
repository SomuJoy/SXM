import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BillingStatusEnum } from '../data-services/account.enums';
import { VehicleInfo } from '../data-services/account.interface';
import { maskEmail } from '../helpers/account-helpers';
import { AccountState, featureKey } from './reducer';

export const selectFeature = createFeatureSelector<AccountState>(featureKey);

export const selectAccount = createSelector(selectFeature, (state) => state?.account);
export const getAccountServiceAddressState = createSelector(selectAccount, (account) => account?.serviceAddress?.state);
export const getSecondarySubscriptions = createSelector(selectFeature, (state) => state?.secondarySubscriptions);
export const getSecondaryStreamingSubscriptions = createSelector(selectFeature, (state) => state?.secondaryStreamingSubscriptions);
export const getAccountPresenceViewModel = createSelector(selectAccount, (account) => {
    if (!account) {
        return null;
    }
    return {
        customerName: account?.firstName,
        accountNumber: account?.accountNumber,
    };
});

export const getPersonalInfoSummary = createSelector(selectAccount, (account) => ({
    firstName: account?.firstName,
    lastName: account?.lastName,
    phone: account?.phone,
    username: account?.userName,
    email: account?.email,
    country: account?.billingAddress?.country,
}));

export const getAccountSubscriptions = createSelector(selectAccount, (account) => account?.subscriptions);
export const getAccountSubscriptionsAsArray = createSelector(selectAccount, (account) =>
    !!account?.subscriptions && Array.isArray(account?.subscriptions) ? account?.subscriptions : []
);
export const getAccountServiceAddress = createSelector(selectAccount, (account) => account && account.serviceAddress);
export const getAccountBillingAddress = createSelector(selectAccount, (account) => account && account.billingAddress);
export const getAccountProfile = createSelector(selectAccount, (account) => account?.accountProfile);
export const getAccountEmail = createSelector(selectAccount, (account) => account?.email);
export const getAccountMaskedEmail = createSelector(selectAccount, (account) => maskEmail(account?.email));
export const getAccountHasClosedDevices = createSelector(selectAccount, (account) => !!account && !!account.closedDevices && account.closedDevices.length > 0);
export const getAccountFirstName = createSelector(selectAccount, (account) => account?.firstName);
export const getAccountLastName = createSelector(selectAccount, (account) => account?.lastName);
export const getAccountPhone = createSelector(selectAccount, (account) => account?.phone);
export const getAccountAccountNumber = createSelector(selectAccount, (account) => account?.accountNumber);
export const getAccountBillingSummary = createSelector(selectAccount, (account) => account?.billingSummary);
export const getAccountBillingStatus = createSelector(getAccountBillingSummary, (billingSummary) => {
    let billingStatus: BillingStatusEnum = null;
    if (!billingSummary) return billingStatus;
    const { amountDue, nextPaymentAmount, isPaymentTypeInvoice } = billingSummary;

    if (isPaymentTypeInvoice) {
        if (amountDue && !nextPaymentAmount) {
            billingStatus = BillingStatusEnum.INV_Current;
        }
        if (amountDue && nextPaymentAmount) {
            billingStatus = BillingStatusEnum.INV_Current_Next;
        }
        if (!amountDue && nextPaymentAmount) {
            billingStatus = BillingStatusEnum.INV_Next;
        }
        if (!amountDue && !nextPaymentAmount) {
            billingStatus = BillingStatusEnum.INV_Suspended;
        }
    } else {
        if (amountDue && !nextPaymentAmount) {
            billingStatus = BillingStatusEnum.CC_Current;
        }
        if (amountDue && nextPaymentAmount) {
            billingStatus = BillingStatusEnum.CC_Current_Next;
        }
        if (!amountDue && nextPaymentAmount) {
            billingStatus = BillingStatusEnum.CC_Next;
        }
        if (!amountDue && !nextPaymentAmount) {
            billingStatus = BillingStatusEnum.CC_Suspended;
        }
    }

    return billingStatus;
});
export const getAccountIsPaymentTypeInvoice = createSelector(getAccountBillingSummary, (billingSummary) => billingSummary?.isPaymentTypeInvoice);

export const getAccountSCEligibleSubscriptions = createSelector(selectFeature, (state) => state?.sCEligibleSubscriptions);
export const getAccountSCEligibleClosedDevices = createSelector(selectFeature, (state) => state?.sCEligibleClosedDevices);
export const getAccountSPEligibleSelfPaySubscriptionIds = createSelector(selectFeature, (state) => state?.sPEligibleSelfPaySubscriptionIds);
export const getAccountSPEligibleClosedRadioIds = createSelector(selectFeature, (state) => state?.sPEligibleClosedRadioIds);
export const getIsEligibleForRegistration = createSelector(selectFeature, (state) => state.isEligibleForRegistration);
export const doAnySCEligibleSubscriptionsHaveDataPlans = createSelector(
    getAccountSCEligibleSubscriptions,
    getAccountSCEligibleClosedDevices,
    (openSubscriptions, closedDevices) => {
        return (
            openSubscriptions.some((subscription) => subscription.plans.some((plan) => plan.dataCapable)) ||
            closedDevices.some((device) => device.subscription.plans.some((plan) => plan.dataCapable))
        );
    }
);
export const getHasAnySCEligible = createSelector(
    getAccountSCEligibleSubscriptions,
    getAccountSCEligibleClosedDevices,
    (scSubscriptions, scClosedDevices) => scSubscriptions.length > 0 || scClosedDevices.length > 0
);

export const getRequiresCredentials = createSelector(selectFeature, (state) => state.requiresCredentials);
export const getAccountSelectedSubscriptionId = createSelector(selectFeature, (state) => state?.selectedSubscriptionId);
/**
 **@deprecated dependent on transaction state sub id, use getAccountFirstSubscription
 **/
export const getFirstAccountSubscription = createSelector(getAccountSubscriptions, getAccountSelectedSubscriptionId, (subscriptions, selectedSubscriptionId) => {
    if (subscriptions) {
        for (const subscription of subscriptions) {
            if (parseInt(subscription.id, 10) === selectedSubscriptionId) {
                return subscription;
            }
        }
    }
    return null;
});
export const getFirstAccountSubscriptionId = createSelector(getFirstAccountSubscription, (subscription) => subscription?.id || null);
export const getAccountHasSubscription = createSelector(getAccountSubscriptions, (subscriptions) => !!subscriptions && subscriptions.length > 0);

const getActiveStreamingSubscriptions = createSelector(getAccountSubscriptions, (subscriptions) =>
    Array.isArray(subscriptions) ? subscriptions?.filter((subscription) => subscription?.streamingService?.status.toLowerCase() === 'active') : []
);
export const getAccountHasActiveStreaming = createSelector(getActiveStreamingSubscriptions, (activeSubscriptions) => activeSubscriptions.length > 0);

export const getFirstAccountSubscriptionPlans = createSelector(getFirstAccountSubscription, (subscription) => subscription?.plans);
export const getFirstAccountSubscriptionPlansAsArray = createSelector(getFirstAccountSubscriptionPlans, (plans) => (!!plans && Array.isArray(plans) ? plans : []));
export const getFirstAccountSubscriptionPlanCodes = createSelector(getFirstAccountSubscriptionPlansAsArray, (plans) => plans.map(({ code }) => ({ code })));
export const getFirstAccountSubscriptionFirstPlan = createSelector(getFirstAccountSubscriptionPlans, (plans) => plans && plans[0]);
export const getFirstAccountSubscriptionFirstPlanPackageName = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.packageName);
export const getFirstAccountSubscriptionFirstPlanPlanCode = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.code);
export const getFirstAccountSubscriptionFirstPlanEndDate = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.endDate);
export const getFirstAccountSubscriptionFirstPlanType = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.type);
export const getFirstAccountSubscriptionRadioService = createSelector(getFirstAccountSubscription, (subscription) => subscription.radioService);
export const getFirstAccountSubscriptionRadioId = createSelector(getFirstAccountSubscriptionRadioService, (radioService) => radioService.last4DigitsOfRadioId);

export const getAccountFirstSubscription = createSelector(getAccountSubscriptions, (subscriptions) => subscriptions && subscriptions[0]);
export const getAccountFirstSubscriptionStreamingService = createSelector(getAccountFirstSubscription, (subscription) => subscription?.streamingService);
export const getAccountFirstSubscriptionStreamingServiceMaskedUsername = createSelector(
    getAccountFirstSubscriptionStreamingService,
    (streamingService) => streamingService?.maskedUserName
);
export const getAccountFirstSubscriptionSubscriptionID = createSelector(getAccountFirstSubscription, (subscription) => subscription?.id);
export const getAccountFirstSubscriptionNickname = createSelector(getAccountFirstSubscription, (subscription) => subscription?.nickname);
export const getAccountFirstSubscriptionPlans = createSelector(getAccountFirstSubscription, (subscription) => subscription?.plans);
export const getAccountFirstSubscriptionFirstTrialPlan = createSelector(getAccountFirstSubscription, (subscription) =>
    subscription?.plans?.find((plan) => plan.type.toUpperCase() === 'TRIAL')
);
export const getAccountFirstSubscriptionFirstPlan = createSelector(getAccountFirstSubscriptionPlans, (plans) => plans && plans[0]);
export const getAccountFirstSubscriptionFirstPlanPackageName = createSelector(getAccountFirstSubscriptionFirstPlan, (plan) => plan?.packageName);
export const getAccountFirstSubscriptionFirstPlanPlanCode = createSelector(getAccountFirstSubscriptionFirstPlan, (plan) => plan?.code);
export const getAccountFirstSubscriptionFirstPlanPlanType = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.type);
export const getAccountFirstSubscriptionFirstPlanTermLength = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.termLength);
export const getAccountFirstSubscriptionRadioService = createSelector(getAccountFirstSubscription, (subscription) => subscription?.radioService);
export const getAccountFirstSubscriptionRadioId = createSelector(getAccountFirstSubscriptionRadioService, (radioService) => radioService?.id);
export const getAccountFirstSubscriptionRadioServiceDevicePromoCode = createSelector(getAccountFirstSubscriptionRadioService, (radioService) => radioService?.devicePromoCode);
export const getAccountFirstSubscriptionStatus = createSelector(getAccountFirstSubscription, (subscription) => subscription?.status);

// NOTE: these are using the getFirstAccountSubscription which is dependent on the selected sub id being set in this domain state.
//       This is not ideal, and we should be looking to remove the usage of these in favor of feature state keeping track of
//       selected sub id (which is considered "transaction state")
export const selectStreamingService = createSelector(getFirstAccountSubscription, (state) => state?.streamingService);
export const selectMaskedUsername = createSelector(selectStreamingService, (state) => state?.maskedUserName);

export const getIsCanada = createSelector(getAccountServiceAddress, (address) => address?.country === 'CA' || address?.country === 'Canada');
export const getIsQuebec = createSelector(getAccountServiceAddress, getIsCanada, (serviceAddress, isCanada) => isCanada && serviceAddress?.state === 'QC');
export const getFirstAccountSubscriptionFollowonPlans = createSelector(getFirstAccountSubscription, (subscription) => subscription?.followonPlans);
export const getFirstAccountSubscriptionBaseFollowonPlan = createSelector(
    getFirstAccountSubscriptionFollowonPlans,
    (followOnPlans) => followOnPlans && followOnPlans.find((plan) => plan.isBasePlan)
);
export const getFirstSubscriptionIsPrimary = createSelector(getFirstAccountSubscription, (subscription) => subscription?.isPrimary);

export const getAccountRadioService = createSelector(getFirstAccountSubscription, (subscription) => subscription?.radioService || null);
export const getAccountIsStreaming = createSelector(getFirstAccountSubscription, (subscription) => subscription && subscription.radioService === null);
export const getAccountRadioServiceId = createSelector(getAccountRadioService, (radioService) => radioService?.id || null);
export const getAccountServiceId = createSelector(
    getAccountRadioService,
    selectStreamingService,
    (radioService, streamingService) => radioService?.id || streamingService?.id || null
);
export const getAccountRadioServiceRadioId = createSelector(getAccountRadioService, (radioService) => radioService?.radioId || radioService?.last4DigitsOfRadioId || null);
export const getAccountRadioServiceRadioIdLast4 = createSelector(getAccountRadioService, (radioService) => radioService?.last4DigitsOfRadioId || null);

export const getAccountVehicleInfo = createSelector(getAccountRadioService, (radioService) => radioService?.vehicleInfo || null);

export const getDeviceFromRadioServiceAndVehicleInfo = createSelector(getAccountRadioServiceRadioId, getAccountVehicleInfo, (radioId, vehicle) => ({
    radioId,
    vehicle,
}));

export const getDeviceFromRadioIdLastFourDigitsAndVehicleInfo = createSelector(getAccountRadioServiceRadioIdLast4, getAccountVehicleInfo, (radioId, vehicle) => ({
    radioId,
    vehicle,
}));

export const getAccountRegistered = createSelector(getAccountProfile, (accountProfile) => accountProfile?.accountRegistered || false);
export const getAccountIsUserNameInTokenSameAsAccount = createSelector(selectFeature, (state) => state?.isUserNameInTokenSameAsAccount || false);
export const getClosedDevicesFromAccount = createSelector(getAccountHasClosedDevices, selectAccount, (hasClosedDevices, account) =>
    hasClosedDevices ? account.closedDevices : null
);

export const getFirstClosedDeviceFromAccount = createSelector(getClosedDevicesFromAccount, (closedDevices) => (closedDevices !== null ? closedDevices[0] : null));
export const getClosedRadioRadioIdLast4 = createSelector(getFirstClosedDeviceFromAccount, (closedDevice) => closedDevice?.last4DigitsOfRadioId || null);

export const getIsClosedRadio = createSelector(
    getAccountHasSubscription,
    getAccountHasClosedDevices,
    (hasSubscription, hasClosedDevice) => !hasSubscription && hasClosedDevice
);

export const getAccountHasAtLeastOneNonTrialPlanInFirstSubscription = createSelector(
    getFirstAccountSubscriptionPlans,
    (plans) => plans && !!plans.find((plan) => plan && plan.type && plan.type !== 'TRIAL')
);
export const getAccountHasAtLeastOneActiveTrialPlanInFirstSubscription = createSelector(
    getFirstAccountSubscriptionPlans,
    (plans) => plans && plans.some((plan) => plan && plan.type && plan.type === 'TRIAL')
);
export const getAccountHasAtLeastOneFollowOnPlanInFirstSubscription = createSelector(
    getFirstAccountSubscriptionFollowonPlans,
    (followOnPlans) => followOnPlans && followOnPlans.length > 0
);

export const getAccountHasActiveSubscription = createSelector(
    getAccountHasAtLeastOneNonTrialPlanInFirstSubscription,
    getAccountHasAtLeastOneFollowOnPlanInFirstSubscription,
    (hasNonTrialPlan, hasFollowOnPlan) => hasNonTrialPlan || hasFollowOnPlan
);

export const getRadioIdLast4OnAccount = createSelector(getAccountRadioServiceRadioIdLast4, getClosedRadioRadioIdLast4, (activeRadioIdLast4, closedRadioIdLast4) =>
    activeRadioIdLast4 ? activeRadioIdLast4 : closedRadioIdLast4
);

export const getAccountState = createSelector(selectAccount, (account) => account?.accountState);
export const getAccountIsInPreTrial = createSelector(getAccountState, (accountState) => accountState?.isInPreTrial);
export const getEmailId = createSelector(selectFeature, (state) => state.email);

export const getMarketingAccountId = createSelector(selectFeature, (state) => state.marketingAccountId);
export const getMaskedAccountNumberOrFullAccountNumber = createSelector(getMarketingAccountId, getAccountAccountNumber, (marketingAccountId, accountNumber) => {
    return accountNumber ?? (marketingAccountId ? `****${marketingAccountId}` : null);
});

export const getMaskedUserNameFromToken = createSelector(selectFeature, (state) => state.maskedUserNameFromToken);
export const getClosedDevicesStatus = createSelector(getFirstClosedDeviceFromAccount, (closedDevices) => closedDevices?.subscription?.status.toLowerCase());

export const getRadioIdSubscriptions = createSelector(getAccountSubscriptions, (subscriptions) =>
    Array.isArray(subscriptions) && subscriptions?.length > 0 ? subscriptions.filter((sbs) => !!sbs?.radioService?.radioId) : []
);

export const getInactiveSubscriptionsRadioIds = createSelector(getRadioIdSubscriptions, (radioSubs) =>
    Array.isArray(radioSubs) && radioSubs?.length > 0 ? radioSubs.filter((sbs) => sbs.status === 'Inactive')?.map((sbs) => sbs.radioService?.radioId) : []
);
export const getClosedDeviceSubscription = createSelector(getFirstClosedDeviceFromAccount, (closeDevices) => closeDevices);
export const getDoesAccountHaveAtLeastOneTrial = createSelector(getAccountSubscriptions, (subscriptions) =>
    subscriptions.some((sub) => sub.plans.some((plan) => plan.type === 'TRIAL'))
);
export const getDoesAccountHaveAtLeastOneSelfPayOrPromo = createSelector(getAccountSubscriptions, (subscriptions) =>
    subscriptions.some((sub) => sub.plans.some((plan) => plan.type === 'SELF_PAY' || plan.type === 'SELF_PAID' || plan.type === 'PROMO' || plan.type === 'PROMO_MCP'))
);

export const getDoesAccountHaveAtLeastOneSelfPay = createSelector(getAccountSubscriptions, (subscriptions) =>
    subscriptions.some((sub) => sub.plans.some((plan) => plan.type === 'SELF_PAY' || plan.type === 'SELF_PAID'))
);

export const getAccountUsername = createSelector(selectAccount, (account) => account?.userName);

export const getAccountBillingSummaryAmountDue = createSelector(getAccountBillingSummary, (billingSummary) => billingSummary?.amountDue);
export const getAccountBillingSummaryIsInCollection = createSelector(getAccountBillingSummary, (billingSummary) => billingSummary?.isAccountInCollection);

export const getMaskedEmailId = createSelector(selectAccount, (account) => account?.maskedEmail);

export const getIsTokenizedLink = createSelector(selectFeature, (state) => state.isTokenizedLink);

export const getPvipSubscriptionsFromAccount = createSelector(getAccountSubscriptions, (subscriptions) => {
    return subscriptions?.filter((subscription) => subscription?.plans?.filter((plan) => plan?.packageName.includes('_VIP'))?.length > 0);
});
export const getPrimarySubscription = createSelector(getAccountSubscriptionsAsArray, (subscriptions) => subscriptions.find((sub) => sub.isPrimary));
export const getPrimarySubscriptionPlansAsArray = createSelector(getPrimarySubscription, (subscription) =>
    !!subscription?.plans && Array.isArray(subscription?.plans) ? subscription?.plans : []
);
export const getPrimarySubscriptionFirstPlan = createSelector(getPrimarySubscriptionPlansAsArray, (plans) => plans[0]);
