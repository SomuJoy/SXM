import { getAllowLicensePlateLookupFlag, getCardOnFile, getIsRefreshAllowed, getShouldIncludeNuCaptcha } from '@de-care/de-care-use-cases/checkout/state-common';
import { createSelector } from '@ngrx/store';
import {
    getPlanRecapAndLegalCopyView,
    getRegistrationViewModel,
    getSelectedRadioId,
    getSelectedYMM,
    getServiceAddressCollected,
    getUseSelectYourRadioUrlForDeviceEdit,
} from './selectors';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getClosedOrInactiveRadioDevicesAsArray } from '@de-care/domains/identity/state-flepz-lookup';
import { getIsClosedRadio } from '@de-care/domains/account/state-account';

export const getLookupDevicePageViewModel = createSelector(getPlanRecapAndLegalCopyView, getAllowLicensePlateLookupFlag, (planRecapAndLegalCopy, allowPlateLookup) => ({
    ...planRecapAndLegalCopy,
    allowLicensePlateLookup: allowPlateLookup,
}));

export const getSelectYourRadioPageViewModel = createSelector(
    getPlanRecapAndLegalCopyView,
    getSelectedRadioId,
    getClosedOrInactiveRadioDevicesAsArray,
    (planRecapAndLegalCopy, selectedRadioId, radioDevicesArray) => ({
        ...planRecapAndLegalCopy,
        radios: radioDevicesArray.reduce((result, device) => {
            result.push({
                vehicleInfo: device.radioService?.vehicleInfo,
                nickname: device?.nickname,
                radioId: device.radioService?.last4DigitsOfRadioId,
                isSelected: device.radioService?.last4DigitsOfRadioId === selectedRadioId,
            });
            return result;
        }, []),
    })
);

// TODO: update this with actual view model data
export const getPaymentPageViewModel = createSelector(
    getPlanRecapAndLegalCopyView,
    getCardOnFile,
    getSelectedYMM,
    getServiceAddressCollected,
    getUseSelectYourRadioUrlForDeviceEdit,
    (planRecapAndLegalCopy, cardOnFile, vehichleInfo, serviceAddressCollected, useSelectYourRadioUrlForDeviceEdit) => ({
        ...planRecapAndLegalCopy,
        paymentMethodOptions: {
            useCardOnFileAllowed: cardOnFile?.status?.toUpperCase() === 'ACTIVE',
            ...(cardOnFile?.type ? { cardType: cardOnFile?.type } : {}),
            ...(cardOnFile?.last4Digits ? { cardNumberLastFour: cardOnFile?.last4Digits } : {}),
        },
        paymentMethodInitialState: {
            useCardOnFile: cardOnFile?.status?.toUpperCase() === 'ACTIVE',
        },
        zipCode: '',
        vehichleInfo,
        serviceAddressCollected,
        useSelectYourRadioUrlForDeviceEdit,
    })
);

export const getReviewPageViewModel = createSelector(
    getPlanRecapAndLegalCopyView,
    getSelectedYMM,
    getQuote,
    getShouldIncludeNuCaptcha,
    getUseSelectYourRadioUrlForDeviceEdit,
    (planRecapAndLegalCopy, vehichleInfo, quote, displayNuCaptcha, useSelectYourRadioUrlForDeviceEdit) => ({
        ...planRecapAndLegalCopy,
        vehichleInfo,
        quote,
        displayNuCaptcha,
        useSelectYourRadioUrlForDeviceEdit,
    })
);

export const getQuoteViewModel = createSelector(getQuote, (quote) => quote || null);

export const getConfirmationPageViewModel = createSelector(
    getSelectedRadioId,
    getQuoteViewModel,
    getRegistrationViewModel,
    getIsClosedRadio,
    (radioIdLastFour, quoteViewModel, registrationViewModel, isClosedRadio) => ({
        radioIdLastFour,
        quoteViewModel,
        registrationViewModel,
        isClosedRadio,
    })
);
