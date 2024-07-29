import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    getAccountSCEligibleSubscriptions,
    getAccountSCEligibleClosedDevices,
    selectAccount,
    getAccountSubscriptions,
    getAccountSPEligibleSelfPaySubscriptionIds,
    getAccountServiceAddressState,
    getAccountSPEligibleClosedRadioIds,
    getFirstAccountSubscriptionFirstPlan,
} from '@de-care/domains/account/state-account';
import { ACSCTargetedState, featureKey, Mode } from '../reducer';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import { getAllOffersAsArray, getPackageNameWithoutPlatform } from '@de-care/domains/offers/state-offers';
import { getDateFormat, getLanguage } from '@de-care/domains/customer/state-locale';
import { formatDate } from '@angular/common';

export const selectFeature = createFeatureSelector<ACSCTargetedState>(featureKey);

export const getRadioIdToReplace = createSelector(selectFeature, (state) => state.radioIdToReplace);
export const getDataForServiceContinuity = createSelector(getRadioIdToReplace, getPvtTime, (radioId, pvtTime) => ({
    radioId,
    pvtTime,
}));

export const getTrialRadioAccount = createSelector(selectFeature, (state) => state.trialRadioAccount);
export const getTrialRadioAccountFirstName = createSelector(getTrialRadioAccount, (account) => account?.firstName);
export const getTrialRadioAccountSubscription = createSelector(getTrialRadioAccount, (account) => account?.subscriptions?.[0]);
export const getTrialRadioAccountSubscriptionRadioService = createSelector(getTrialRadioAccountSubscription, (subscription) => subscription?.radioService);
export const getTrialRadioAccountSubscriptionlast4DigitsOfRadioId = createSelector(
    getTrialRadioAccountSubscriptionRadioService,
    (radioService) => radioService?.last4DigitsOfRadioId
);
export const getTrialRadioAccountSubscriptionVehicleInfo = createSelector(getTrialRadioAccountSubscriptionRadioService, (radioService) => radioService?.vehicleInfo);
export const getTrialRadioAccountSubscriptionFirstPlan = createSelector(getTrialRadioAccountSubscription, (subscription) => subscription?.plans?.[0]);
export const getTrialRadioAccountSubscriptionFirstPlanPackageName = createSelector(getTrialRadioAccountSubscriptionFirstPlan, (plan) => plan?.packageName);
export const getTrialRadioAccountSubscriptionFirstPlanEndDate = createSelector(getTrialRadioAccountSubscriptionFirstPlan, (plan) => plan?.endDate);

export const getFullTrialRadioId = createSelector(selectFeature, (state) => state.fullTrialRadioId);
export const getTrialClosedDevices = createSelector(getTrialRadioAccount, (account) => account?.closedDevices);
export const getTrialFirstClosedDevice = createSelector(getTrialClosedDevices, (device) => device?.[0]);
export const getTrialFirstClosedDeviceVehicleInfo = createSelector(getTrialFirstClosedDevice, (device) => device?.vehicleInfo);

export const getDataForAccountConsolidate = createSelector(getTrialRadioAccountSubscriptionlast4DigitsOfRadioId, (radioId) => ({
    trialRadioId: radioId,
}));

export const getMode = createSelector(selectFeature, (state) => state.mode);
export const getDefaultMode = createSelector(selectFeature, (state) => state.defaultMode);
export const getIsModeServiceContinuity = createSelector(getMode, (mode) => mode === Mode.ServiceContinuity);
export const getIsModeServicePortability = createSelector(getMode, (mode) => mode === Mode.ServicePortability);
export const getIsSelfPayPreSelected = createSelector(selectFeature, (state) => state.isSelfPayPreSelected);
export const getTrialRadioAccountServiceAddress = createSelector(getTrialRadioAccount, (account) => account && account.serviceAddress);
export const getTrialRadioAccountState = createSelector(getTrialRadioAccount, (account) => account?.serviceAddress?.state);
export const getTrialRadioIsCanada = createSelector(getTrialRadioAccountServiceAddress, (address) => address?.country === 'CA' || address?.country === 'Canada');
export const getTrialRadioIsQuebec = createSelector(
    getTrialRadioAccountServiceAddress,
    getTrialRadioIsCanada,
    (serviceAddress, isCanada) => isCanada && serviceAddress?.state === 'QC'
);

export const getCustomerInfo = createSelector(
    getTrialRadioAccountFirstName,
    getAccountSCEligibleSubscriptions,
    getAccountSCEligibleClosedDevices,
    getTrialRadioAccountSubscriptionFirstPlan,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getFullTrialRadioId,
    getTrialRadioAccountSubscriptionVehicleInfo,
    getDefaultMode,
    (firstName, eligibleSubscriptions, eligibleClosedDevices, currentPlan, last4DigitsOfRadioId, radioId, vehicle, defaultMode) => ({
        firstName,
        eligibleSubscriptions,
        eligibleClosedDevices,
        currentSubscription: {
            currentPlan,
            radioIdDisplay: radioId ?? `(****${last4DigitsOfRadioId})`,
            radioId: radioId ?? last4DigitsOfRadioId,
            vehicle,
        },
        defaultMode,
    })
);

export const getSelectedOffer = createSelector(selectFeature, (state) => state.selectedOffer);
export const getSelectedOfferPackageName = createSelector(getSelectedOffer, (offer) => offer?.packageName);
export const getPaymentType = createSelector(selectFeature, (state) => state.paymentType);
export const getSelectedOfferPriceChangeMessagingType = createSelector(getSelectedOffer, (offer) => offer?.priceChangeMessagingType);
export const getSelectedOfferTermLength = createSelector(getSelectedOffer, (offer) => offer?.termLength);
export const getFirstAccountPlanChangeMessagingType = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.priceChangeMessagingType);
export const getFirstAccountPlanTermLength = createSelector(getFirstAccountSubscriptionFirstPlan, (plan) => plan?.termLength);

export const getSelectedSelfPaySubscription = createSelector(getAccountSCEligibleSubscriptions, getRadioIdToReplace, (subscriptions, radioId) => {
    return subscriptions.find((subscription) => subscription.radioService.last4DigitsOfRadioId === radioId);
});
export const getSelectedClosedRadio = createSelector(getAccountSCEligibleClosedDevices, getRadioIdToReplace, (closedDevices, radioId) => {
    return closedDevices.find((closedDevice) => closedDevice.last4DigitsOfRadioId === radioId);
});
export const getIsSelfPayRadioClosed = createSelector(selectFeature, (state) => state.isSelfPayRadioClosed);
export const getSelectedSelfPaySubscriptionFromActiveOrClosed = createSelector(
    getSelectedSelfPaySubscription,
    getSelectedClosedRadio,
    getIsSelfPayRadioClosed,
    (selfPaySubscription, closedRadio, isSelfPayClosed) => (isSelfPayClosed ? closedRadio?.subscription : selfPaySubscription)
);
export const getIsUserNameSameAsEmail = createSelector(selectFeature, (state) => state.isUserNameSameAsEmail);
export const getShowOffers = createSelector(selectFeature, (state) => state.showOffers);
export const selectHasStateDataForConfirmationPage = createSelector(getTrialRadioAccount, selectAccount, (trialAccount, account) => !!trialAccount && !!account);
export const getProgramCode = createSelector(selectFeature, (state) => state.programCode);
export const getMarketingPromoCode = createSelector(selectFeature, (state) => state.marketingPromoCode);
export const getIsTrialEndingImmediately = createSelector(getTrialRadioAccountSubscriptionFirstPlan, (trialPlan) => (trialPlan?.dataCapable ? true : false));
export const getTrialRadioAccountSubscriptionBasePlanPackageName = createSelector(getTrialRadioAccountSubscription, (subscription) =>
    subscription && subscription.plans ? subscription.plans.find((p) => p.isBasePlan)?.packageName : undefined
);
export const getHideInYourTrialCopy = createSelector(
    getTrialRadioAccountSubscriptionBasePlanPackageName,
    getAllOffersAsArray,
    (basePlanPackageName, offers) => offers.findIndex((p) => p.packageName === basePlanPackageName) === -1
);
export const getSelectedSelfPaySubscriptionIdFromOAC = createSelector(selectFeature, (state) => state.selectedSelfPaySubscriptionIdFromOAC);
export const getIsLoggedIn = createSelector(selectFeature, (state) => state.isLoggedIn);

export const getLoadOffersPayloadForAlreadyConsolidated = createSelector(getTrialRadioIsCanada, getTrialRadioIsQuebec, (isCanadaMode, isQuebec) => ({
    programCode: isCanadaMode ? 'CAMCPMM5' : 'TRIALEXT',
    streaming: false,
    student: false,
    ...(isCanadaMode && { province: isQuebec ? 'QC' : 'ON' }),
}));
export const getEligibilityStatus = createSelector(selectFeature, (state) => state.eligibilityStatus);
export const getSelfPayAccountNumberForACOnly = createSelector(selectFeature, (state) => state.selfPayAccountNumberForACOnly);
export const getACAccountDataRequest = createSelector(getRadioIdToReplace, getPvtTime, getSelfPayAccountNumberForACOnly, (radioId, pvtTime, accountNumber) =>
    accountNumber ? { accountNumber, pvtTime } : { radioId, pvtTime }
);

export const getSubscriptionBySubscriptionIdFromOac = createSelector(getAccountSubscriptions, getSelectedSelfPaySubscriptionIdFromOAC, (subscriptions, subId) =>
    subscriptions?.find((subscription) => subscription?.id === subId)
);
export const getLast4DigitsOfRadioIdOfSubscriptionForSwap = createSelector(
    getSubscriptionBySubscriptionIdFromOac,
    (subscription) => subscription?.radioService?.last4DigitsOfRadioId
);
export const getSwapNewRadioService = createSelector(selectFeature, (state) => state.swapNewRadioService);
export const getSwapNewRadioId = createSelector(getSwapNewRadioService, (radioService) => radioService?.radioId);
export const getSwapNewRadioVin = createSelector(getSwapNewRadioService, (radioService) => radioService?.vehicleInfo?.vin);

export const getCountryCodeForPaymentInfo = createSelector(getIsCanadaMode, (isCanadaMode) => (isCanadaMode ? 'CA' : 'US'));
export const getIsAccountAddressInQuebec = createSelector(getAccountServiceAddressState, getIsCanadaMode, (state, isCanada) => isCanada && state === 'QC');
export const getNotToShowPlusFees = createSelector(getIsAccountAddressInQuebec, (inQuebec) => inQuebec);

export const getSelectedSubscriptionIDForSAL = createSelector(selectFeature, (state) => state?.selectedSubscriptionIDForSAL);

export const getSelfPayYMMCopy = createSelector(
    getSelectedSelfPaySubscription,
    getSelectedClosedRadio,
    getIsSelfPayRadioClosed,
    (selfPaySubscription, closedRadio, isSelfPayClosed) => {
        const { radioService } = selfPaySubscription || {};
        const { vehicleInfo } = radioService || {};
        return isSelfPayClosed
            ? closedRadio?.vehicleInfo?.year && closedRadio?.vehicleInfo?.make && closedRadio?.vehicleInfo?.model
                ? `${closedRadio.vehicleInfo.year} ${closedRadio.vehicleInfo.make} ${closedRadio.vehicleInfo.model}`
                : null
            : vehicleInfo?.make
            ? `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`
            : null;
    }
);
export const getSelfPayRadioIdCopy = createSelector(
    getSelectedSelfPaySubscription,
    getSelectedClosedRadio,
    getIsSelfPayRadioClosed,
    getIsLoggedIn,
    (selfPaySubscription, closedRadio, isSelfPayClosed, isLoggedIn) => {
        return isSelfPayClosed
            ? `****${closedRadio?.last4DigitsOfRadioId}`
            : isLoggedIn
            ? selfPaySubscription?.radioService?.radioId
            : `****${selfPaySubscription?.radioService?.last4DigitsOfRadioId}`;
    }
);
export const getTrialYMMCopy = createSelector(getTrialRadioAccountSubscriptionVehicleInfo, (vehicleInfo) => {
    return vehicleInfo?.year && vehicleInfo?.make && vehicleInfo?.model ? `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}` : null;
});
export const getTrialRadioIdCopy = createSelector(getTrialRadioAccountSubscriptionlast4DigitsOfRadioId, getFullTrialRadioId, (last4DigitsOfTrialRadioId, trialRadioId) => {
    return trialRadioId ?? `****${last4DigitsOfTrialRadioId}`;
});
export const getTrialPlanPackageNameCopyWithoutPlatform = createSelector(
    getTrialRadioAccountSubscriptionFirstPlanPackageName,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (packageName, packageDescriptions) => {
        return getPackageNameWithoutPlatform(packageDescriptions?.[packageName]?.name, packageName);
    }
);
export const getSelfPayPlanPackageName = createSelector(
    getSelectedSelfPaySubscriptionFromActiveOrClosed,
    (selfPaySubscription) => selfPaySubscription?.plans?.[0].packageName
);
export const getSelfPayPlanPackageNameCopy = createSelector(
    getSelfPayPlanPackageName,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (selfPayPackageName, packageDescriptions) => {
        const packageName = selfPayPackageName;
        return packageDescriptions?.[packageName]?.name;
    }
);
export const getSelfPayPlanPackageNameCopyWithoutPlatform = createSelector(
    getSelectedSelfPaySubscriptionFromActiveOrClosed,
    getSelfPayPlanPackageNameCopy,
    (selfPaySubscription, packageNameCopy) => {
        const packageName = selfPaySubscription?.plans?.[0].packageName;
        return getPackageNameWithoutPlatform(packageNameCopy, packageName);
    }
);
export const getTrialRadioAccountSubscriptionFirstPlanEndDateFormatted = createSelector(
    getTrialRadioAccountSubscriptionFirstPlanEndDate,
    getDateFormat,
    getLanguage,
    (endDate, dateFormat, lang) => {
        return formatDate(endDate, dateFormat, lang);
    }
);
export const getIsSelectedSelfPayClosedRadioIdEligibleForSP = createSelector(
    getAccountSCEligibleClosedDevices,
    getAccountSPEligibleClosedRadioIds,
    (closedDevices, closedRadioIds) => {
        const devRadioIds = closedDevices?.map((dev) => dev?.last4DigitsOfRadioId);
        return devRadioIds?.some((radioId) => closedRadioIds?.includes(radioId));
    }
);
export const getIsSelectedSelfPayEligibleForSP = createSelector(
    getSelectedSelfPaySubscriptionFromActiveOrClosed,
    getAccountSPEligibleSelfPaySubscriptionIds,
    getIsSelectedSelfPayClosedRadioIdEligibleForSP,
    (selfPaySubscription, spEligibleSelfPaySubscriptionIds, spEligibleClosedRadioIds) =>
        spEligibleSelfPaySubscriptionIds?.includes(selfPaySubscription?.id) || spEligibleClosedRadioIds
);

export const getIsRefreshAllowed = createSelector(selectFeature, (state) => state.isRefreshAllowed);
