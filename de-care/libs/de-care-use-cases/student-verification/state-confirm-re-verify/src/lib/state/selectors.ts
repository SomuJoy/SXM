export { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
export { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
export { getSheerIdIdentificationReVerificationWidgetUrl } from '@de-care/shared/state-settings';
export { selectOffer } from '@de-care/domains/offers/state-offers';
export { getFirstAccountSubscription } from '@de-care/domains/account/state-account';
export { getQuote } from '@de-care/domains/quotes/state-quote';
import {
    getAccountEmail,
    getAccountHasClosedDevices,
    getAccountHasSubscription,
    getAccountRadioService,
    getAccountRegistered,
    getFirstAccountSubscription,
    getFirstAccountSubscriptionFirstPlanPackageName,
    getFirstClosedDeviceFromAccount,
    selectMaskedUsername,
    getIsEligibleForRegistration,
    getRequiresCredentials,
    getIsClosedRadio,
} from '@de-care/domains/account/state-account';
import { getAllNonDataCapableOffersAsArray, selectOffer } from '@de-care/domains/offers/state-offers';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { featureKey, StudentReverifyGuardState } from './reducer';

export const selectOfferRetailPrice = createSelector(selectOffer, (state) => state.retailPrice);
export const selectOfferTermLength = createSelector(selectOffer, (state) => state?.termLength || null);
export const selectOfferPackageName = createSelector(selectOffer, (state) => state?.packageName || null);

export const selectReverifyGuardWorkflowState = createFeatureSelector<StudentReverifyGuardState>(featureKey);

export const selectActiveSubscriptionViewModel = createSelector(getFirstAccountSubscriptionFirstPlanPackageName, selectMaskedUsername, (packageName, maskedUserName) => ({
    packageName,
    maskedUserName,
}));

export const rolloverVMDevice = createSelector(
    getAccountHasSubscription,
    getAccountHasClosedDevices,
    getAccountRadioService,
    getFirstClosedDeviceFromAccount,
    (hasSubscription, hasClosedDevices, radioService, closedDevice) => {
        if (!hasSubscription && !hasClosedDevices) {
            return null;
        }

        return {
            radioId: hasSubscription ? radioService?.last4DigitsOfRadioId : closedDevice?.last4DigitsOfRadioId || null,
            vehicleInfo: hasSubscription ? radioService?.vehicleInfo : closedDevice?.vehicleInfo || null,
        };
    }
);

export enum PlanTypeEnum {
    PromoMCP = 'PROMO_MCP',
    Default = 'DEFAULT',
}
function isOfferMCP(val: PlanTypeEnum) {
    return [PlanTypeEnum.PromoMCP].indexOf(val) !== -1;
}

export const mapOffersForSummary = (offersData, offer) => (
    (offersData[offer.planCode] = { isMCP: isOfferMCP(offer.type as PlanTypeEnum), termLength: offer.termLength }), offersData
);

export const rolloverVMOffer = createSelector(selectOffer, getAllNonDataCapableOffersAsArray, (pkg, allOffers) => {
    return {
        offersData: allOffers.reduce((offersData, offer) => mapOffersForSummary(offersData, offer), {}),
        package: pkg,
        offerType: pkg?.type || PlanTypeEnum.Default,
        isOfferStreamingEligible: true,
    };
});

export const rolloverVMAccount = createSelector(getFirstAccountSubscription, selectMaskedUsername, (subscription, maskedUserName) => ({
    isNewAccount: false,
    maskedUserName,
    isClosedOrNoRadio: false,
}));

export const rolloverVMUser = createSelector(
    getIsEligibleForRegistration,
    getRequiresCredentials,
    getIsClosedRadio,
    (isEligibleForRegistration, requiresCredentials, isClosedRadio) => ({
        isEligibleForRegistration,
        requiresCredentials,
        isStreaming: true,
        isClosedRadio,
    })
);

export const rollerVMRegister = createSelector(getAccountRegistered, (accountRegistered) => {
    return {
        registrationCompleted: accountRegistered || false,
        passwordError: null,
    };
});

export const rollerVMMixedData = createSelector(getAccountEmail, (email) => {
    return {
        registerCompData: {
            email: email || '',
            isOfferStreamingEligible: true,
            useEmailAsUsername: false, // [TODO] Srini to add to nonPII Account response from token
        },
    };
});

export const rolloverVM = createSelector(
    rolloverVMOffer,
    rolloverVMAccount,
    rolloverVMUser,
    rolloverVMDevice,
    rollerVMMixedData,
    rollerVMRegister,
    getQuote,
    (offerData, accountData, userData, deviceData, mixedData, registerData, quote) => ({
        ...offerData,
        ...accountData,
        ...userData,
        ...deviceData,
        ...mixedData,
        ...registerData,
        ...{ quote },
    })
);

export { getFirstAccountSubscriptionId as getSubscriptionId } from '@de-care/domains/account/state-account';
export { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
export { getQueryParamsAndSettings } from '@de-care/de-care-use-cases/student-verification/state-common';
