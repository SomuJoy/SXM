import { getAccountFirstName, getFirstAccountSubscriptionId, getIsTokenizedLink } from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { createSelector } from '@ngrx/store';
import { DeviceCredentialsStatus } from './models';
import { getOrderSummaryData, getOrderSummaryExtraData } from './review-order.selectors';
import {
    getDevicesCredentialsStatuses,
    getDevicesExistingMaskedUserNames,
    getFirstDevice,
    getFirstDeviceExistingEmailOrUsername,
    getFirstDeviceExistingMaskedUserName,
    getFirstDeviceStatus,
    getSecondDevice,
    getSecondDeviceStatus,
} from './selectors';

const getHasUpgradingErrors = createSelector(getFirstDeviceStatus, getSecondDevice, getSecondDeviceStatus, (firstTaskStatus, secondDevice, secondTaskStatus) =>
    !secondDevice ? firstTaskStatus === 'error' : firstTaskStatus === 'error' || secondTaskStatus === 'error'
);

export const getRegisterData = createSelector(
    getAccountFirstName,
    getFirstAccountSubscriptionId,
    getSecurityQuestions,
    getFirstDeviceExistingEmailOrUsername,
    getIsTokenizedLink,
    getFirstDeviceExistingMaskedUserName,
    (firstName, subscriptionId, securityQuestions, email, isTokenizedLink, firstDeviceExistingMaskedUserName) => ({
        account: {
            email: email,
            useEmailAsUserName: true,
            firstName,
            hasUserCredentials: false,
            hasExistingAccount: false,
            subscriptionId,
            maskedEmail: isTokenizedLink ? firstDeviceExistingMaskedUserName : null,
        },
        securityQuestions,
    })
);

export const getConfirmationPageViewModel = createSelector(
    getHasUpgradingErrors,
    getFirstDevice,
    getSecondDevice,
    getOrderSummaryData,
    getOrderSummaryExtraData,
    getRegisterData,
    getDevicesCredentialsStatuses,
    getDevicesExistingMaskedUserNames,
    (hasUpgradingErrors, firstDevice, secondDevice, orderSummaryData, extraData, registerData, devicesCredentialsStatuses, devicesExistingMaskedUserNames) => ({
        hasUpgradingErrors,
        hasPendingCredentials:
            devicesCredentialsStatuses.firstDeviceCredentialsStatus !== DeviceCredentialsStatus.AlreadyRegistered ||
            devicesCredentialsStatuses.secondDeviceCredentialsStatus !== DeviceCredentialsStatus.AlreadyRegistered,
        selectedDevices: {
            firstRadio: firstDevice,
            secondRadio: secondDevice,
        },
        devicesCredentialsStatuses,
        quotes: orderSummaryData?.quotes,
        extraData: {
            ...extraData,
            showTotalAsPaid: true,
        },
        registerData,
        devicesExistingMaskedUserNames,
    })
);

export const completedTransactionDataExists = createSelector(getOrderSummaryData, (orderSummaryData) => !!orderSummaryData);
