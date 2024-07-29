import { createSelector } from '@ngrx/store';
import { getAccountFirstName, getFirstAccountSubscriptionFirstPlan, getLastFourDigitsOfAccountNumber } from '@de-care/domains/account/state-account';
import {
    featureState,
    getAccountRadioInfo,
    getSecondDevices,
    getSelectedPlanCode,
    getFirstRadioIsTrial,
    getSelectedSecondarySubscription,
    getSecondDevice,
    getSecondDeviceExistingMaskedUserName,
    getSecondDeviceCredentialStatus,
    getPlatinumSubscriptionLast4,
    inboundQueryParams,
    getStreamingAccounts,
    getSelectedStreamingAccount,
    getIsStreaming,
    getSecondDeviceRadioIdLast4Digits,
} from './selectors';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { DeviceCredentialsStatus } from './models';
import { selectOffer } from '@de-care/domains/offers/state-offers';
import { getIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';

export { selectAccountData, selectedPaymentMethodViewModel } from './payment-info.selectors';

export const selectedDevicesViewModel = createSelector(featureState, ({ firstDevice, secondDevice, selectedStreamingAccount }) => ({
    firstDevice,
    secondDevice,
    selectedStreamingAccount,
}));

export const getErrorCode = createSelector(featureState, (state) => state?.errorCode);

export const getDisplayNucaptcha = createSelector(featureState, (state) => state.displayNucaptcha);

const getQuoteSummaryForAddSecondRadio = createSelector(getQuote, selectOffer, getIsStreaming, getSecondDeviceRadioIdLast4Digits, (quote, offer, isStreaming, last4Digits) => {
    if (!quote) {
        return null;
    }
    const renewalQuote = quote.renewalQuote;
    const balance = parseFloat(renewalQuote?.currentBalance?.toString() || '0');
    const details = renewalQuote?.details?.[0];
    // pricePerMonth should come from quote api, but for secondary device, we are getting it from offer selector.
    const pricePerMonth = offer?.retailPrice;
    return {
        hasBalance: balance > 0 || balance < 0,
        balance,
        pricePerMonth: pricePerMonth,
        paymentStartDate: details.startDate,
    };
});

export const getSelectedSecondRadioSummary = createSelector(getSelectedSecondarySubscription, getSecondDevice, (selectedSecondarySubscription, secondDevice) => {
    const plan = selectedSecondarySubscription?.plans?.[0];
    return {
        status: secondDevice?.status,
        isSelfPaid: plan?.type === 'SELF_PAID',
        packageName: plan?.packageName,
        vehicleInfo: secondDevice?.vehicle,
        last4DigitsOfRadioId: secondDevice?.radioId,
    };
});

export const getAddSecondDevicesOrderSummary = createSelector(getSelectedSecondRadioSummary, getQuoteSummaryForAddSecondRadio, (selectedSecondRadio, quoteSummary) => {
    if (!selectedSecondRadio || !quoteSummary) {
        return null;
    }
    return {
        ...selectedSecondRadio,
        ...quoteSummary,
    };
});

export const getConfirmationDataForAddSecondRadio = createSelector(
    getAddSecondDevicesOrderSummary,
    getSecondDevice,
    getSelectedStreamingAccount,
    getSecondDeviceExistingMaskedUserName,
    getSecondDeviceCredentialStatus,
    getPlatinumSubscriptionLast4,
    getIsRefreshAllowed,
    (orderSummary, secondDevice, streamingAccount, secondDeviceExistingMaskedUsername, secondRadioCredentialStatus, platinumSubscriptionLast4, isRefreshAllowed) => ({
        secondDevice,
        streamingAccount,
        orderSummary,
        alreadyRegistered: secondRadioCredentialStatus === DeviceCredentialsStatus.AlreadyRegistered,
        secondDeviceExistingMaskedUsername,
        platinumSubscriptionLast4,
        isRefreshAllowed,
    })
);

export const getFirstStepData = createSelector(
    getAccountFirstName,
    getAccountRadioInfo,
    getFirstAccountSubscriptionFirstPlan,
    getSecondDevices,
    getFirstRadioIsTrial,
    getStreamingAccounts,
    (firstName, accountRadioInfo, accountFirstPlan, secondDevices, isFirstRadioTrial, streamingAccounts) => ({
        firstName,
        currentVehicle: accountRadioInfo?.vehicleInfo,
        currentRadioId: accountRadioInfo?.last4DigitsOfRadioId,
        currentPackageName: accountFirstPlan?.packageName,
        secondVehicles: secondDevices,
        isFirstRadioTrial,
        streamingAccounts,
    })
);

// Todo parse the info we are going to need
export const getQuoteViewModel = createSelector(getQuote, (quote) => quote || null);

export const getAddSecondDevicesFirstStepData = createSelector(
    getSecondDevices,
    getStreamingAccounts,
    getSelectedSecondRadioSummary,
    getPlatinumSubscriptionLast4,
    (secondDevices, streamingAccounts, selectedSecondRadio, platinumSubscriptionLast4) => ({
        secondVehicles: secondDevices,
        streamingAccounts,
        selectedSecondRadio,
        platinumSubscriptionLast4,
    })
);

export const getAccountLookupStepData = createSelector(
    getAccountRadioInfo,
    getFirstAccountSubscriptionFirstPlan,
    getFirstRadioIsTrial,
    (accountRadioInfo, accountFirstPlan, isFirstRadioTrial) => ({
        currentVehicle: accountRadioInfo?.vehicleInfo,
        currentRadioId: accountRadioInfo?.last4DigitsOfRadioId,
        currentPackageName: accountFirstPlan?.packageName,
        isFirstRadioTrial,
    })
);

export const getOfferInfoDetails = createSelector(getSelectedPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return offersInfo[planCode];
});

export const getHeroData = createSelector(getOfferInfoDetails, (offerInfoDetails) => ({
    ...offerInfoDetails?.salesHero,
    classes: ['bottom-padding'],
}));

export const getOfferDescription = createSelector(getOfferInfoDetails, (offerInfo) => {
    if (offerInfo?.offerDescription) {
        const { offerDescription, packageDescription, presentation, numberOfBullets } = offerInfo;
        return {
            platformPlan: packageDescription.packageName,
            priceAndTermDescTitle: offerDescription.priceAndTermDescTitle,
            processingFeeDisclaimer: offerDescription.processingFeeDisclaimer,
            icons: packageDescription.icons,
            detailsTitle: packageDescription.highlightsTitle,
            details: packageDescription.highlightsText,
            footer: packageDescription.footer,
            promoFooter: packageDescription.promoFooter,
            toggleCollapsed: packageDescription.packageShowToggleText,
            toggleExpanded: packageDescription.packageHideToggleText,
            theme: presentation.theme,
            presentation: presentation.style,
            numberOfBullets: numberOfBullets,
            packageFeatures: packageDescription?.packageFeatures,
        };
    }
});

export const getOfferDetails = createSelector(getOfferInfoDetails, (offerInfo) => offerInfo?.offerDetails);

export {
    getCompleteOrderStatusIsProcesssing,
    getReviewDataLoadIsProcessing,
    getOrderSummaryData,
    getOrderSummaryExtraData,
    getReviewOrderHeaderViewModelData,
    purchaseTransactionRequestDataExists,
} from './review-order.selectors';

export { getFirstDevice, getSecondDevice, getFirstDeviceStatus, getSecondDeviceStatus } from './selectors';

export { getConfirmationPageViewModel, completedTransactionDataExists } from './confirmation-page.selectors';

export { getIsCanadaMode } from '@de-care/domains/customer/state-locale';

export { selectOffer as getLeadOfferViewModel } from '@de-care/domains/offers/state-offers';

export const getSubscriptionIdPrimaryRadio = createSelector(featureState, (state) => state?.subscriptionIdPrimaryRadio || null);
export const getSubscriptionIdSecondaryRadio = createSelector(featureState, (state) => state?.subscriptionIdSecondaryRadio || null);

export const getRequireValidateUserRadioModal = createSelector(inboundQueryParams, ({ token }) => !!token);
