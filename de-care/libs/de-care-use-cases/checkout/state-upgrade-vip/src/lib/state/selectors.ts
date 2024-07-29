import {
    getAccountRadioService,
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    getFirstClosedDeviceFromAccount,
    getPersonalInfoSummary,
    getSecondarySubscriptions,
} from '@de-care/domains/account/state-account';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, UpgradeVipState } from './reducer';

export const featureState = createFeatureSelector<UpgradeVipState>(featureKey);
export const getSecondDevices = createSelector(featureState, (state) => state.secondDevices);
export const getStreamingAccounts = createSelector(featureState, (state) => state.streamingAccounts);
export const getSelectedStreamingAccount = createSelector(featureState, (state) => state.selectedStreamingAccount);
export const getIsStreaming = createSelector(featureState, (state) => state.isStreaming);

export const getFirstDevice = createSelector(featureState, (state) => state?.firstDevice || null);
export const getSecondDevice = createSelector(featureState, (state) => state?.secondDevice || null);

export const getSecondDeviceSubscriptionStatus = createSelector(getSecondarySubscriptions, getSecondDevice, (secondarySubscriptions, secondDevice) => {
    return (secondDevice && secondarySubscriptions?.find((subscription) => secondDevice.radioId === subscription.radioService.last4DigitsOfRadioId))?.status || null;
});

export const getSelectedPlanCode = createSelector(featureState, (state) => state.selectedPlanCode);
export const getStreamingVipPlanCode = createSelector(featureState, (state) => state.selectedStreamingPlanCode);
export const getFirstDeviceStatus = createSelector(featureState, (state) => state?.firstDeviceStatus);
export const getSecondDeviceStatus = createSelector(featureState, (state) => state?.secondDeviceStatus);

export const inboundQueryParams = createSelector(
    getNormalizedQueryParams,
    ({ tkn: token = null, programcode: programCode = null, langpref: langPref = null, subscriptionid: subscriptionId = null, act: accountNumber = null }) => ({
        token,
        programCode,
        langPref,
        subscriptionId,
    })
);

export const getDevicesCredentialsStatuses = createSelector(featureState, (state) => ({
    firstDeviceCredentialsStatus: state.firstDeviceCredentialsStatus,
    secondDeviceCredentialsStatus: state.secondDeviceCredentialsStatus,
}));

export const getSecondDeviceCredentialStatus = createSelector(featureState, (state) => state.secondDeviceCredentialsStatus);

export const getDevicesExistingMaskedUserNames = createSelector(featureState, (state) => ({
    firstDeviceExistingMaskedUsername: state.firstDeviceExistingMaskedUsername,
    secondDeviceExistingMaskedUsername: state.secondDeviceExistingMaskedUsername,
}));

export const getFirstDeviceExistingMaskedUserName = createSelector(featureState, (state) => state.firstDeviceExistingMaskedUsername);
export const getSecondDeviceExistingMaskedUserName = createSelector(featureState, (state) => state.secondDeviceExistingMaskedUsername);

export const getFirstDeviceExistingEmailOrUsername = createSelector(featureState, (state) => state.firstDeviceExistingEmailOrUsername);

export const selectedPaymentMethod = createSelector(featureState, (state) => state.selectedPaymentMethod);
export const getPaymentInfo = createSelector(featureState, (state) => state.newCard);

// First Step Data Output
export const getSecondDeviceRadioIdLast4Digits = createSelector(getSecondDevice, (secondDevice) => secondDevice?.radioId);
export const getSecondDeviceSubscriptionId = createSelector(getSecondarySubscriptions, getSecondDevice, (secondarySubscriptions, secondDevice) => {
    return (secondDevice && secondarySubscriptions?.find((subscription) => secondDevice.radioId === subscription.radioService.last4DigitsOfRadioId))?.id || null;
});
export const getSecondDeviceInfo = createSelector(
    getSecondDeviceRadioIdLast4Digits,
    getSecondDeviceSubscriptionId,
    getSelectedStreamingAccount,
    getStreamingVipPlanCode,
    getPersonalInfoSummary,
    (secondDeviceRadioIdLast4Digits, secondDeviceSubscriptionId, selectedStreamingAccount, streamingVipPlanCode, personalInfoSummary) => ({
        secondDeviceRadioIdLast4Digits,
        secondDeviceSubscriptionId,
        selectedStreamingAccount,
        streamingVipPlanCode,
        personalInfoSummary,
    })
);

export const getProgramCode = createSelector(featureState, (state) => state.programCode);
export const getAccountRadioInfo = createSelector(
    getAccountRadioService,
    getFirstClosedDeviceFromAccount,
    (accountRadioService, accountClosedRadio) => accountRadioService || accountClosedRadio
);

export const getAccountRadioInfoLast4 = createSelector(getAccountRadioInfo, (radioInfo) => radioInfo?.last4DigitsOfRadioId);
export const getRadioIdAndVehicleInfoFromAccountRadio = createSelector(getAccountRadioInfo, (radioInfo) => ({
    radioId: radioInfo?.last4DigitsOfRadioId,
    vehicle: radioInfo?.vehicleInfo,
}));
export { getAccountHasAtLeastOneActiveTrialPlanInFirstSubscription as getFirstRadioIsTrial } from '@de-care/domains/account/state-account';

export const getFirstRadioIsClosed = createSelector(getClosedDevicesFromAccount, getFirstDevice, (closedDevices, firstDevice) => {
    return closedDevices?.some((closedDevice) => closedDevice?.radioId === firstDevice?.radioId || firstDevice?.radioId.endsWith(closedDevice?.last4DigitsOfRadioId));
});

export const getSecondRadioIsClosed = createSelector(getSecondDeviceSubscriptionStatus, (secondDeviceSubscriptionStatus) => {
    return secondDeviceSubscriptionStatus?.toLowerCase() === 'closed';
});

export const getQueryParamsForCheckoutRedirect = createSelector(featureState, (state) => {
    let errorCode = '';
    switch (state.errorCode) {
        case 'SUBSCRIPTION_HAS_TRIAL_PLAN_WITH_NO_FOLLOW_ON':
            errorCode = '109';
            break;
        case 'SUBSCRIPTION_IS_CLOSED':
            errorCode = 'UpgradeVIPFallback';
            break;
    }
    return {
        radioid: state.userEnteredRadioid,
        act: '**' + state.userEnteredAccountNumber.slice(-4),
        errorCode,
    };
});

export const getSelectedSecondarySubscription = createSelector(getSecondDevice, getSecondarySubscriptions, (secondDevice, secondarySubscriptions) => {
    return secondDevice && secondarySubscriptions?.find((secondarySubscription) => secondarySubscription?.radioService?.last4DigitsOfRadioId === secondDevice?.radioId);
});

export const getPlatinumPackageSubscriptionId = createSelector(featureState, (state) => state.platinumPackageSubscriptionId);

export const getAccountPlatinumSubscription = createSelector(
    getPlatinumPackageSubscriptionId,
    getAccountSubscriptions,
    (platinumPackageSubscriptionId, accountSubscriptions) => accountSubscriptions?.find((subscription) => subscription.id === platinumPackageSubscriptionId)
);

export const getPlatinumSubscriptionLast4 = createSelector(getAccountPlatinumSubscription, (subscription) => subscription?.radioService?.last4DigitsOfRadioId);

export const getAccountCurrentVipPlanCode = createSelector(getAccountPlatinumSubscription, (subscription) => subscription?.plans[0].code);
