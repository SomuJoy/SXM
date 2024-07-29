import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { CheckoutState, CHECKOUT_CONSTANT } from '@de-care/checkout-state';
import { PurchaseState } from '../states/purchase.state';
import { PurchaseStateConstant } from '../../purchase-state.constant';
import { getCurrentQuote, getQuote } from '@de-care/domains/quotes/state-quote';

export const parentRadioInfo = (state: CheckoutState) => {
    let radioId: string;
    let isClosedRadio = false;

    if (state.account) {
        const subscription = state.account.subscriptions && state.account.subscriptions[0];
        if (subscription && subscription.radioService) {
            isClosedRadio = false;
            radioId = subscription.radioService.last4DigitsOfRadioId;
        } else if (state.account.closedDevices && state.account.closedDevices.length > 0) {
            isClosedRadio = true;
            radioId = state.account.closedDevices[0].last4DigitsOfRadioId;
        }
    }

    return {
        radioId,
        isClosedRadio,
    };
};
export const formStep = (state: PurchaseState) => state.formStatus.formStep;
export const paymentInfo = (state: PurchaseState) => state.paymentInfo;
export const serviceAddress = (state: PurchaseState) => state.paymentInfo.serviceAddress;
export const subscriptions = (state: CheckoutState) => (state.account ? state.account.subscriptions : null);

export const paymentName = (state: PurchaseState) => state.paymentInfo.name;
export const paymentCCNumber = (state: PurchaseState) => state.paymentInfo.cardNumber;
export const paymentCCMonth = (state: PurchaseState) => state.paymentInfo.expireMonth;
export const paymentCCYear = (state: PurchaseState) => state.paymentInfo.expireYear;
export const paymentCCV = (state: PurchaseState) => state.paymentInfo.CVV;
export const paymentTxId = (state: PurchaseState) => state.paymentInfo.transactionId;
export const useSavedCard = (state: PurchaseState) => state.paymentInfo.useSavedCard;
export const flep = (state: PurchaseState) => state.paymentInfo.flep;
export const ccError = (state: PurchaseState) => state.paymentInfo.ccError;
export const passwordInvalidError = (state: PurchaseState) => state.paymentInfo.passwordInvalidError;
export const passwordContainsPiiDataError = (state: PurchaseState) => state.paymentInfo.passwordContainsPiiDataError;
export const resetTransactionId = (state: PurchaseState) => state.paymentInfo.resetTransactionId;
export const paymentInfoEmail = (state: PurchaseState) => state.paymentInfo.email;
export const prepaidCard = (state: PurchaseState) => state.prepaidCard;
export const data = (state: PurchaseState) => state && state.data;
export const loadingState = (state: PurchaseState) => state.formStatus.loading;
export const campaignState = (state: PurchaseState) => state.formStatus.upsellCode;

export const packageUpgrades = (state: PurchaseState) => state.packageUpgrades;
export const selectedOffers = (state: CheckoutState) => state.selectedOffer;

export const purchaseSelector: MemoizedSelector<object, PurchaseState> = createFeatureSelector<PurchaseState>(PurchaseStateConstant.STORE.NAME);
export const checkoutSelector: MemoizedSelector<object, CheckoutState> = createFeatureSelector<CheckoutState>(CHECKOUT_CONSTANT.STORE.NAME);

export const originalOffers = createSelector(checkoutSelector, (state: CheckoutState) => (state.offer ? state.offer.offers : null));

export const getServiceError = createSelector(purchaseSelector, (state: PurchaseState) => state.serviceError);

// Purchase Step
export const getFormStep = createSelector(purchaseSelector, formStep);

export const getSubscriptions = createSelector(checkoutSelector, subscriptions);

export const getData = createSelector(purchaseSelector, data);

export const getAccountData = createSelector(getData, (dataState) => dataState.account);

export const getAccountCustomerInfoEmail = createSelector(getAccountData, (account) => (account && account.customerInfo ? account.customerInfo.email : ''));

export const getMarketingPromoCode = createSelector(getData, (dataState) => dataState && dataState.marketingPromoCode);

export const getHideMarketingPromoCode = createSelector(getData, (dataState) => dataState && dataState.hideMarketingPromoCode);

export const getProgramAndMarketingPromoCodes = createSelector(getData, (dataState) => ({
    programCode: dataState.programCode,
    marketingPromoCode: dataState.marketingPromoCode,
}));

export const radio = createSelector(checkoutSelector, parentRadioInfo);

export const getPaymentInfo = createSelector(purchaseSelector, paymentInfo);

export const getPaymentInfoEmail = createSelector(purchaseSelector, paymentInfoEmail);

export const getServiceAddress = createSelector(purchaseSelector, serviceAddress);

export const getUpgrade = createSelector(purchaseSelector, packageUpgrades);

export const getCurrentOffer = createSelector(getData, (_data) => !!_data && !!_data.offer && _data.offer.offers);

export const getFlep = createSelector(purchaseSelector, flep);

export const getPlatformChangedFlag = createSelector(getData, (dataResult) => dataResult.platformChangedFlag);
export const getPlatformChangeUpsellDeferred = createSelector(getData, (dataResult) => dataResult.platformChangeUpsellDeferred);

export const getUpgrades = createSelector(
    getCurrentOffer,
    getUpgrade,
    getPlatformChangedFlag,
    getPlatformChangeUpsellDeferred,
    (originalOffer, upgradeOffers, platformChangedFlag, platformChangeUpsellDeferred) => {
        return {
            originalOffer,
            upgradeOffers,
            platformChangedFlag,
            platformChangeUpsellDeferred,
        };
    }
);

export const getPrepaid = createSelector(purchaseSelector, prepaidCard);

export const getCCError = createSelector(purchaseSelector, ccError);

export const getPasswordInvalidError = createSelector(purchaseSelector, passwordInvalidError);
export const getPasswordContainsPiiDataError = createSelector(purchaseSelector, passwordContainsPiiDataError);

export const getResetTransactionId = createSelector(purchaseSelector, resetTransactionId);

export const loadingMode = createSelector(purchaseSelector, loadingState);

export const getUpsellCode = createSelector(purchaseSelector, campaignState);

export const getFormState = createSelector(loadingMode, getUpsellCode, getFormStep, getCCError, (loading, upsellCode, step, ccErr) => {
    return (
        {
            loading,
            upsellCode,
            formStep: step,
            ccErr,
        } || null
    );
});

export const getSelectedOffer = createSelector(getData, (dataState) => dataState.selectedOffer);

export const getSelectedOfferOrOffer = createSelector(getData, getSelectedOffer, (dataState, selectedOffer) => (selectedOffer ? selectedOffer : dataState.offer));
export const getPriceChangeViewModel = createSelector(getSelectedOfferOrOffer, getCurrentQuote, (selectedOfferOrOffer, currentQuote) => {
    const priceChangeMessagingTypeValue = selectedOfferOrOffer.offers[0].priceChangeMessagingType;
    const termLength = selectedOfferOrOffer.offers[0].termLength;
    const priceChangeMessagingType = currentQuote?.details[0]?.isMilitary ? priceChangeMessagingTypeValue + '_MILITARY' : priceChangeMessagingTypeValue;
    return {
        priceChangeMessagingTypeFeatureFlag: ['MSRP', 'MRD'].includes(priceChangeMessagingTypeValue) && termLength === 1,
        priceChangeMessagingType: priceChangeMessagingType,
    };
});
export const getReviewOrder = createSelector(purchaseSelector, (state) => state?.reviewOrder || null);
export const getSubmitOrderRequested = createSelector(getReviewOrder, (reviewOrder) => reviewOrder?.agreement || false);

export const selectHasStateDataForConfirmationPage = createSelector(getSelectedOfferOrOffer, getAccountData, (offer, account) => !!offer && !!account);
export const getAccountProfile = createSelector(getAccountData, (account) => account?.accountProfile || null);
export const getAccountRegistered = createSelector(getAccountProfile, (accountProfile) => accountProfile?.accountRegistered || false);
export const getIsTwoFactorAuthNeeded = createSelector(getData, (info) => info?.isTwoFactorAuthNeeded);

export const getMaskedPhoneNumber = createSelector(getData, (result) => result?.maskedPhoneNumber);

export const getPurchaseState = createSelector(getFormStep, getPrepaid, getData, getCCError, getResetTransactionId, (step, cardValue, dataState, ccErr, resetTransId) => {
    return (
        {
            cardValue,
            data: dataState,
            ccErr,
            resetTransactionId: resetTransId,
            formStep: step,
        } || null
    );
});

// Review selector
export const getCCName = createSelector(purchaseSelector, paymentName);
export const getCCNumber = createSelector(purchaseSelector, paymentCCNumber);
export const getCCMonth = createSelector(purchaseSelector, paymentCCMonth);
export const getCCYear = createSelector(purchaseSelector, paymentCCYear);
export const getCCTransactionId = createSelector(purchaseSelector, paymentTxId);
export const SavedCard = createSelector(purchaseSelector, useSavedCard);
export const getCCCVV = createSelector(purchaseSelector, paymentCCV);
export const getCCInfo = createSelector(
    getCCName,
    getCCNumber,
    getCCMonth,
    getCCYear,
    getCCCVV,
    getCCTransactionId,
    SavedCard,
    (ccName, ccNum, ccMonth, ccYear, ccCVV, ccTransactionId, ccSaved) => {
        return (
            {
                ccName,
                ccNum,
                ccMonth,
                ccYear,
                ccCVV,
                ccTransactionId,
                ccSaved,
            } || null
        );
    }
);

export const selectedCheckoutOffers = createSelector(checkoutSelector, selectedOffers);

export const reviewOffers = createSelector(getSelectedOffer, selectedCheckoutOffers, getQuote, (purchaseOffers, checkoutOffers, quotes) => {
    // this code is horrible, but is faster way we have for fixing an issue with empty quotes
    // take into account that this legacy flow will be replaced by new streaming flow
    if (checkoutOffers && !checkoutOffers?.offers[0]?.quote && quotes) {
        return {
            ...checkoutOffers,
            offers: checkoutOffers.offers.map((offer, index) => ({
                ...offer,
                ...(index === 0 ? { quote: quotes } : {}),
            })),
        };
    }

    if (!checkoutOffers && purchaseOffers && !purchaseOffers?.offers[0]?.quote && quotes) {
        return {
            ...purchaseOffers,
            offers: purchaseOffers.offers.map((offer, index) => ({
                ...offer,
                ...(index === 0 ? { quote: quotes } : {}),
            })),
        };
    }
    return checkoutOffers || purchaseOffers;
});
export const reviewState = createSelector(
    getFormStep,
    getPrepaid,
    getCCInfo,
    radio,
    getCurrentOffer,
    reviewOffers,
    getPaymentInfo,
    getSubscriptions,
    (step, prepaid, creditcard, comingRadio, currentOffers, offers, paymentInf, accSubscriptions) => {
        const subscription = accSubscriptions && accSubscriptions[0];
        return (
            {
                step,
                prepaid,
                creditcard,
                billingAddress: paymentInf.billingAddress,
                serviceAddress: paymentInf.serviceAddress,
                radioId: comingRadio.radioId,
                isClosedRadio: comingRadio.isClosedRadio,
                currentOffers,
                offers,
                email: paymentInf.email,
                flep: paymentInf.flep,
                password: paymentInf.password,
                isTrial: subscription ? subscription.plans[0]?.type === 'TRIAL' : false,
                isClosedStreaming: !subscription,
            } || null
        );
    }
);

export const getSuccessfulTransactionSubscriptionId = createSelector(getData, (state) => state?.successfulTransactionSubscriptionId);
export const getIsRefreshAllowed = createSelector(getData, (state) => state.isRefreshAllowed);
export { getQuote } from '@de-care/domains/quotes/state-quote';
