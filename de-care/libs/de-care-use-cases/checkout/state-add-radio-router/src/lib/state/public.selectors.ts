import { createSelector } from '@ngrx/store';
import { getDeviceInfo, getOffersAddSelectionData, getRegistrationViewModel, getSelectedRadioId, getTransactionSubscriptionId } from './selectors';
import { getClosedOrInactiveRadioDevicesAsArray } from '@de-care/domains/identity/state-flepz-lookup';
import { getIsCanada, getIsClosedRadio } from '@de-care/domains/account/state-account';
import {
    getCardOnFile,
    getLongDescriptionPlanRecapCardViewModel,
    getPaymentInfo,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedPlanCode,
    getShouldIncludeNuCaptcha,
    getUseCardOnFile,
    selectInboundQueryParams,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getQuote } from '@de-care/domains/quotes/state-quote';

export { getSelectedRadioId } from './selectors';
export { getDeviceInfo } from './selectors';

export const getRadioIdFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.radioid);

export const getVehicleInfoVM = createSelector(getDeviceInfo, (deviceInfo) => {
    const nickname = deviceInfo?.nickname;
    const vehicleInfo = deviceInfo?.vehicleInfo;
    const hasDuplicateVehicleInfo = deviceInfo?.hasDuplicateVehicleInfo;

    let last4OfRadioId: string;
    let yearMakeModel;

    if (!nickname) {
        yearMakeModel = vehicleInfo?.year || vehicleInfo?.make || vehicleInfo?.model ? vehicleInfo : null;
        if (!yearMakeModel || hasDuplicateVehicleInfo) {
            last4OfRadioId = deviceInfo?.last4DigitsOfRadioId;
        }
    }

    const vehicleInfoVM = {
        ...(nickname && { nickname }),
        ...(yearMakeModel && { yearMakeModel }),
        ...(last4OfRadioId && { last4OfRadioId }),
    };

    return vehicleInfoVM;
});

export const getQuoteViewModel = createSelector(getQuote, (quote) => quote || null);

export const getListenNowTokenViewModel = createSelector(getTransactionSubscriptionId, (subscriptionId) => ({
    subscriptionId: subscriptionId?.toString(),
    useCase: '',
}));

export const getConfirmationPageViewModel = createSelector(
    getListenNowTokenViewModel,
    getSelectedRadioId,
    getQuoteViewModel,
    getRegistrationViewModel,
    getIsClosedRadio,
    (listenNowTokenViewModel, radioIdLastFour, quoteViewModel, registrationViewModel, isClosedRadio) => ({
        listenNowTokenViewModel,
        radioIdLastFour,
        quoteViewModel,
        registrationViewModel,
        isClosedRadio,
    })
);

export const getUserEnteredDataForTargetedPaymentInfo = createSelector(getPaymentInfo, getUseCardOnFile, (paymentInfo, useCardOnFile) =>
    paymentInfo || useCardOnFile
        ? {
              serviceAddress: paymentInfo?.serviceAddress,
              creditCard: {
                  nameOnCard: paymentInfo?.nameOnCard,
                  cardNumber: paymentInfo?.cardNumber,
                  expirationDate: paymentInfo?.cardExpirationDate,
              },
              useCardOnFile,
          }
        : null
);

export const getReviewPageViewModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getLongDescriptionPlanRecapCardViewModel,
    getVehicleInfoVM,
    getQuote,
    getShouldIncludeNuCaptcha,
    (legalCopy, planRecapCard, vehicleInfo, quote, displayNuCaptcha) => ({
        legalCopy,
        planRecapCard,
        vehicleInfo,
        quote,
        displayNuCaptcha,
    })
);

export const getPaymentMethodOptionsViewModel = createSelector(getCardOnFile, (cardOnFile) => ({
    useCardOnFileAllowed: cardOnFile?.status?.toUpperCase() === 'ACTIVE',
    ...(cardOnFile?.type ? { cardType: cardOnFile?.type } : {}),
    ...(cardOnFile?.last4Digits ? { cardNumberLastFour: cardOnFile?.last4Digits } : {}),
}));

export const getPaymentPageViewModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getLongDescriptionPlanRecapCardViewModel,
    getPaymentMethodOptionsViewModel,
    getUserEnteredDataForTargetedPaymentInfo,
    getVehicleInfoVM,
    (legalCopy, planRecapCard, paymentMethodOptions, paymentInfo, vehicleInfo) => ({
        legalCopy,
        planRecapCard,
        paymentMethodOptions,
        paymentInfo,
        vehicleInfo,
    })
);

export const getPaymentInterstitialPageViewModel = createSelector(getVehicleInfoVM, (vehicleInfo) => ({
    vehicleInfo,
}));

export const getPickAPlanPageViewModel = createSelector(
    getVehicleInfoVM,
    getSelectedPlanCode,
    getOffersAddSelectionData,
    getSelectedOfferOfferInfoLegalCopy,
    (vehicleInfo, planCode, offersAddSelectionData, legalCopy) => ({
        vehicleInfo,
        planCode,
        offersAddSelectionData,
        legalCopy,
    })
);

export const getLookupDevicePageViewModel = createSelector(getIsCanada, (isCanada) => ({
    allowLicensePlateLookup: !isCanada,
}));

export const getSelectYourRadioPageViewModel = createSelector(getSelectedRadioId, getClosedOrInactiveRadioDevicesAsArray, (selectedRadioId, radioDevicesArray) => ({
    radios: radioDevicesArray.reduce((result, device) => {
        result.push({
            vehicleInfo: device.radioService?.vehicleInfo,
            nickname: device?.nickname,
            radioId: device.radioService?.last4DigitsOfRadioId,
            isSelected: device.radioService?.last4DigitsOfRadioId === selectedRadioId,
        });
        return result;
    }, []),
}));
