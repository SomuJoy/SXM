import { createSelector } from '@ngrx/store';
import {
    selectFeature,
    getTrialRadioAccountSubscriptionVehicleInfo,
    getCustomerInfo,
    getSelectedSelfPaySubscription,
    getIsSelfPayRadioClosed,
    getSelectedClosedRadio,
    getIsLoggedIn,
} from './state.selectors';
import { isPromo } from '../helpers';

export const getIsYmmIdentical = createSelector(
    getSelectedSelfPaySubscription,
    getSelectedClosedRadio,
    getIsSelfPayRadioClosed,
    getTrialRadioAccountSubscriptionVehicleInfo,
    (selfPaySubscription, closedRadio, isSelfPayClosed, trialVehicleInfo) => {
        const vehicleInfo = isSelfPayClosed ? closedRadio?.vehicleInfo : selfPaySubscription?.radioService?.vehicleInfo;
        return !!vehicleInfo?.year && !!vehicleInfo?.make && !!vehicleInfo?.model && JSON.stringify(vehicleInfo) === JSON.stringify(trialVehicleInfo);
    }
);

export const getTrialSubscriptionInfo = createSelector(getCustomerInfo, (customerInfo) => {
    const { currentSubscription } = customerInfo || {};
    const { vehicle, currentPlan, radioIdDisplay } = currentSubscription || {};
    const { packageName, type, endDate } = currentPlan || {};
    return {
        vehicle,
        radioId: radioIdDisplay,
        endDate,
        packageName,
        username: 'string',
        isTrialRadio: type === 'TRIAL',
        isSelfPay: type === 'SELF_PAY',
        showIcon: true,
    };
});

// this is coming from the selected eligible selfpay account
export const getTransferFromInfo = createSelector(
    getSelectedSelfPaySubscription,
    getSelectedClosedRadio,
    getIsSelfPayRadioClosed,
    getIsYmmIdentical,
    getIsLoggedIn,
    (selfPaySubscription, closedRadio, isSelfPayClosed, isYmmIdentical, isLoggedIn) => {
        const vehicleInfo = isSelfPayClosed ? closedRadio?.vehicleInfo : selfPaySubscription?.radioService?.vehicleInfo;
        const radioId = isSelfPayClosed
            ? `(****${closedRadio?.last4DigitsOfRadioId})`
            : isLoggedIn
            ? selfPaySubscription?.radioService?.radioId
            : `(****${selfPaySubscription?.radioService?.last4DigitsOfRadioId})`;
        const plans = isSelfPayClosed ? closedRadio?.subscription?.plans : selfPaySubscription?.plans;
        const endDate = isSelfPayClosed ? closedRadio?.closedDate : new Date().toISOString();
        const { packageName, termLength, type } = plans?.[0] || {};
        return {
            radioId,
            vehicle: vehicleInfo,
            packageName,
            endDate,
            termLength,
            isPromo: isPromo(type),
            isSelfPayClosed,
            isYmmIdentical,
        };
    }
);
export const getRemoveOldRadioId = createSelector(selectFeature, (state) => state.removeOldRadioId);
