import { createSelector } from '@ngrx/store';
import {
    selectFeature,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getSelectedOffer,
    getTrialRadioAccountSubscriptionFirstPlanEndDate,
    getTrialRadioAccountSubscriptionVehicleInfo,
    getIsTrialEndingImmediately,
    getFullTrialRadioId,
    getSubscriptionBySubscriptionIdFromOac,
    getSwapNewRadioService,
    getLast4DigitsOfRadioIdOfSubscriptionForSwap,
    getCountryCodeForPaymentInfo,
    getMarketingPromoCode,
    getProgramCode,
    getTrialRadioAccount,
    getSelfPayYMMCopy,
    getSelfPayRadioIdCopy,
    getTrialYMMCopy,
    getTrialRadioIdCopy,
    getIsSelfPayRadioClosed,
    getTrialPlanPackageNameCopyWithoutPlatform,
    getSelfPayPlanPackageNameCopyWithoutPlatform,
    getTrialRadioAccountSubscriptionFirstPlanEndDateFormatted,
    getIsSelectedSelfPayEligibleForSP,
    getSelectedSelfPaySubscriptionFromActiveOrClosed,
    getTrialRadioAccountSubscriptionFirstPlanPackageName,
    getTrialRadioAccountSubscriptionRadioService,
    getSelfPayPlanPackageName,
    getSelectedOfferTermLength,
    getSelectedOfferPriceChangeMessagingType,
    getFirstAccountPlanChangeMessagingType,
    getIsModeServicePortability,
    getIsRefreshAllowed,
} from './state.selectors';
import { getIsYmmIdentical, getRemoveOldRadioId } from './vehicle-subscription.selectors';
import { getCurrentQuote, getQuoteIsMilitary, getCurrentQuoteAmoutIsZero } from '@de-care/domains/quotes/state-quote';
import { getPersonalInfoSummary, getIsQuebec, getAccountEmail, selectAccount, getAccountIsPaymentTypeInvoice } from '@de-care/domains/account/state-account';
import { isPromo, isRadioPlatformSirius, setFooterMessage } from '../helpers';
import { getIsCanadaMode, getOACUrl } from '@de-care/settings';
import { getDateFormat, getLanguage, getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { getSwapSelfPaySubscriptionPackageName, getSwapSelfPayFullRadioId } from './swap.selectors';
import { packageTypeIsSelect, getPlatformFromPackageName, PackagePlatformEnum, getPackageNameWithoutPlatform } from '@de-care/domains/offers/state-offers';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getHasNoActiveCardOnFile } from './choose-payment.selectors';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import { formatDate } from '@angular/common';

export { getIsTrialEndingImmediately, getIsLoggedIn, getDefaultMode, getEligibilityStatus, getSelectedSelfPaySubscription } from './state.selectors';
export { doAnySCEligibleSubscriptionsHaveDataPlans } from '@de-care/domains/account/state-account';

// Vehicle subscription selectors
// this is coming from the offer and trial
export const getSubscriptionInfo = createSelector(
    getTrialRadioAccountSubscriptionVehicleInfo,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getFullTrialRadioId,
    getTrialRadioAccountSubscriptionFirstPlanEndDate,
    getSelectedOffer,
    getIsYmmIdentical,
    getIsTrialEndingImmediately,
    (vehicleInfo, last4DigitsOfRadioId, radioId, endDate, offer, isYmmIdentical, isTrialEndingImmediately) => {
        const { termLength, type, packageName } = offer || {};
        const startDate = isTrialEndingImmediately ? new Date().toISOString() : endDate;
        return {
            vehicle: {
                ...vehicleInfo,
            },
            radioId: radioId ?? `(****${last4DigitsOfRadioId})`,
            packageName,
            startDate,
            termLength,
            isPromo: isPromo(type),
            isYmmIdentical,
        };
    }
);

// Review Order selectors
export const getChangeSubscriptionData = createSelector(
    selectFeature,
    getTrialRadioAccountSubscriptionlast4DigitsOfRadioId,
    getPersonalInfoSummary,
    getCurrentQuote,
    getIsTrialEndingImmediately,
    getCountryCodeForPaymentInfo,
    ({ selectedPlanCode, useCardOnFile, paymentInfo, paymentType, transactionId }, radioId, account, currentQuote, isTrialEndingImmediately, country) => {
        const address = {
            phone: account?.phone,
            avsvalidated: false,
            streetAddress: paymentInfo?.billingAddress?.addressLine1,
            city: paymentInfo?.billingAddress?.city,
            state: paymentInfo?.billingAddress?.state,
            postalCode: paymentInfo?.billingAddress?.zip,
            country: paymentInfo?.country ?? country,
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
        };
        const changeSubData = isTrialEndingImmediately
            ? {
                  radioId,
                  plans: [{ planCode: selectedPlanCode }],
              }
            : {
                  radioId,
                  followOnPlans: [{ planCode: selectedPlanCode }],
              };
        if (paymentType === 'invoice' || useCardOnFile) {
            return { ...changeSubData, paymentInfo: { useCardOnfile: useCardOnFile, paymentType, transactionId } };
        } else {
            return {
                ...changeSubData,
                paymentInfo: {
                    useCardOnfile: useCardOnFile,
                    paymentType,
                    transactionId,
                    cardInfo: {
                        cardNumber: paymentInfo?.ccNum,
                        expiryMonth: paymentInfo?.ccExpDate?.split('/')[0],
                        expiryYear: paymentInfo?.ccExpDate?.split('/')[1],
                        nameOnCard: paymentInfo?.ccName,
                    },
                    paymentAmount:
                        currentQuote &&
                        (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') &&
                        Math.sign(currentQuote.currentBalance + 0) === 1
                            ? currentQuote.currentBalance
                            : null,
                },
                billingAddress: address,
                serviceAddress: address,
            };
        }
    }
);

// Login selectors
export const getShowLoginChat = createSelector(getIsCanadaMode, (isCanadaMode) => !isCanadaMode);
export const getOACLoginRedirectUrl = createSelector(getOACUrl, getLanguagePrefix, (url, lang) => {
    const langPref = lang === 'en' ? '' : `&langpref=${lang}`;
    return `${url}login_view.action?reset=true${langPref}`;
});

export const displayPromoCodeForm = createSelector(
    getIsCanadaMode,
    getMarketingPromoCode,
    getProgramCode,
    (isCanadaMode, marketingPromoCode, programCode) => isCanadaMode && !marketingPromoCode && !programCode
);

// Swap
export const getTransferFromInfoForSwap = createSelector(getSubscriptionBySubscriptionIdFromOac, (selfPaySubscription) => {
    const vehicleInfo = selfPaySubscription?.radioService?.vehicleInfo;
    const radioId = selfPaySubscription?.radioService?.radioId;
    const plans = selfPaySubscription?.plans;
    const endDate = plans?.[0]?.endDate;
    const renewalDate = plans?.[0]?.nextCycleOn;
    const { packageName, termLength, type } = plans?.[0] || {};
    const multiplePlans = plans?.length > 1 ? plans?.map((plan) => ({ packageName: plan.packageName, termLength: plan.termLength, isPromo: isPromo(plan.type) })) : null;
    return {
        radioId,
        vehicle: vehicleInfo,
        packageName,
        endDate,
        renewalDate,
        isLifetime: !endDate && !renewalDate && termLength === 0,
        termLength,
        isPromo: isPromo(type),
        multiplePlans,
    };
});

// vehicle/radio come from new/closed radio entered by the user, while packagename/date come from the selfpay subscription
export const getNewRadioInfoForSwap = createSelector(getSwapNewRadioService, getSubscriptionBySubscriptionIdFromOac, (newRadioService, selfPaySubscription) => {
    const { plans } = selfPaySubscription || {};
    const { packageName, termLength, type } = plans?.[0] || {};
    const { radioId: newRadioId, last4DigitsOfRadioId: last4DigitsOfNewRadioId, vehicleInfo: vehicle } = newRadioService || {};
    const endDate = plans?.[0]?.endDate;
    const renewalDate = plans?.[0]?.nextCycleOn;
    const multiplePlans = plans?.length > 1 ? plans?.map((plan) => ({ packageName: plan.packageName, termLength: plan.termLength, isPromo: isPromo(plan.type) })) : null;
    return {
        vehicle,
        radioId: newRadioId ?? `(****${last4DigitsOfNewRadioId})`,
        endDate,
        renewalDate,
        isLifetime: !endDate && !renewalDate && termLength === 0,
        packageName,
        termLength,
        isPromo: isPromo(type),
        multiplePlans,
    };
});

export const getShowSwapChat = createSelector(getIsCanadaMode, (isCanadaMode) => !isCanadaMode);
export const getShowQuoteAndPayment = createSelector(getIsCanadaMode, getCurrentQuoteAmoutIsZero, (isCanada, currentQuoteIsZero) => !(isCanada || currentQuoteIsZero));
export const getShowGST = createSelector(getIsCanadaMode, (isCanadaMode) => isCanadaMode);
export const getShowQST = createSelector(getIsCanadaMode, getIsQuebec, (isCanadaMode, isQuebec) => isCanadaMode && isQuebec);
export const getShowPlatformChangeForSwap = createSelector(
    getSwapSelfPaySubscriptionPackageName,
    getSwapSelfPayFullRadioId,
    getSwapNewRadioService,
    (selfPayPackageName, selfPayRadioId, newRadioService) => {
        const selfPayIsSirius = isRadioPlatformSirius(selfPayRadioId);
        const newRadioIsSirius = isRadioPlatformSirius(newRadioService.radioId ?? newRadioService.last4DigitsOfRadioId);
        const packageIsSelect = packageTypeIsSelect(selfPayPackageName);
        // check if one of the platforms is Sirius but not both
        const isSiriusAndPlatformDiscrepancy = [selfPayIsSirius, newRadioIsSirius].includes(true) && selfPayIsSirius !== newRadioIsSirius;
        return isSiriusAndPlatformDiscrepancy && packageIsSelect ? true : false;
    }
);
// closed radios do not show the correct previous plan information (SMS issues), so the diffPackageName must be implied (hardcoding it here).
// TODO: this problem with sms might be fixed, evaluate if this will need to be changed at that time
export const getPlatformChangeDataForSwap = createSelector(getSwapSelfPaySubscriptionPackageName, (packageName) => ({
    currentPackageName: packageName,
    diffPackageName: getPlatformFromPackageName(packageName) === PackagePlatformEnum.Sirius ? '1_' + packageName : packageName.match(/_(.*)/)?.[1],
}));

export const getSwapQuoteSummaryData = createSelector(getQuote, (quote) => {
    const { currentQuote } = quote || {};
    return {
        currentCharges: {
            totalDue: currentQuote?.currentBalance,
            totalTaxesAndFeesAmount: currentQuote?.totalTaxesAndFeesAmount,
            fees: currentQuote?.fees,
            taxes: currentQuote?.taxes,
            previousBalance: currentQuote?.previousBalance?.toString() === '0.00' ? null : currentQuote?.previousBalance,
            creditRemainingOnAccount: currentQuote.details.find((detail) => detail.balanceType === 'CREDIT_REMAINING_ON_ACCOUNT')?.priceAmount,
        },
    };
});

export const getHasStateDataForSwapConfirmation = createSelector(getSwapNewRadioService, selectAccount, (newRadioService, account) => !!newRadioService && !!account);
export const getSwapConfirmationData = createSelector(getAccountEmail, getSwapNewRadioService, getIsRefreshAllowed, (email, newRadioService, isRefreshAllowed) => {
    return { email, newRadioId: newRadioService.radioId ?? newRadioService.last4DigitsOfRadioId, isRefreshAllowed };
});
export const getCanSwapConfirmationShowStreaming = createSelector(getSubscriptionBySubscriptionIdFromOac, (subscription) => subscription?.streamingService);

export const getSwapTransactionData = createSelector(
    selectFeature,
    getSwapNewRadioService,
    getLast4DigitsOfRadioIdOfSubscriptionForSwap,
    getPersonalInfoSummary,
    getCurrentQuote,
    getCountryCodeForPaymentInfo,
    ({ useCardOnFile, paymentInfo, paymentType, transactionId }, { last4DigitsOfRadioId: last4DigitsOfNewRadioId }, selfPayRadioId, account, currentQuote, country) => {
        const address = {
            phone: account?.phone,
            avsvalidated: false,
            streetAddress: paymentInfo?.billingAddress?.addressLine1,
            city: paymentInfo?.billingAddress?.city,
            state: paymentInfo?.billingAddress?.state,
            postalCode: paymentInfo?.billingAddress?.zip,
            country: paymentInfo?.country ?? country,
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
        };
        const swapData = {
            newRadioId: last4DigitsOfNewRadioId,
            oldRadioId: selfPayRadioId,
        };
        if (!paymentType) {
            return { ...swapData, paymentInfo: null };
        } else if (useCardOnFile) {
            return { ...swapData, paymentInfo: { useCardOnfile: useCardOnFile, paymentType, transactionId } };
        } else {
            return {
                ...swapData,
                paymentInfo: {
                    useCardOnfile: useCardOnFile,
                    paymentType,
                    transactionId,
                    cardInfo: {
                        cardNumber: paymentInfo?.ccNum,
                        expiryMonth: paymentInfo?.ccExpDate?.split('/')[0],
                        expiryYear: paymentInfo?.ccExpDate?.split('/')[1],
                        nameOnCard: paymentInfo?.ccName,
                    },
                    paymentAmount:
                        currentQuote &&
                        (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') &&
                        Math.sign(currentQuote.currentBalance + 0) === 1
                            ? currentQuote.currentBalance
                            : null,
                },
                billingAddress: address,
            };
        }
    }
);

// Service Portability
export const getHasStateDataForPortRadio = createSelector(getTrialRadioAccount, selectAccount, (trialAccount, account) => !!trialAccount && !!account);
export const getHasStateDataForPortConfirmation = createSelector(getTrialRadioAccount, selectAccount, (trialAccount, account) => !!trialAccount && !!account);

export const getRouteToServicePortability = createSelector(
    getIsSelectedSelfPayEligibleForSP,
    getIsCanadaMode,
    getHasNoActiveCardOnFile,
    getAccountIsPaymentTypeInvoice,
    (isEligibleForSP, isCanada, hasNoActiveCardOnFile, isInvoice) => isEligibleForSP && (isCanada || isInvoice || !hasNoActiveCardOnFile)
    // Current business logic is to route (non-invoice) US customers with expired or about-to-expire cards to SC
);
export const getShowPortPaymentPage = createSelector(
    getHasNoActiveCardOnFile,
    getAccountIsPaymentTypeInvoice,
    getIsCanadaMode,
    (hasNoActiveCardOnFile, isInvoice, isCanadaMode) => isCanadaMode && (hasNoActiveCardOnFile || isInvoice)
    // Current business logic is to only show the payment page to Canada customers who's CC is expired or about-to-expire, or they use invoice billing
);
export const getFetchOffers = createSelector(getRouteToServicePortability, (routeToSP) => !routeToSP);
export type PortDetailFooter = 'FOOTER_SERVICE_OFF' | 'FOOTER_SERVICE_OFF_REMOVE' | 'FOOTER_REMAINING_DAYS' | 'FOOTER_NO_SERVICE' | 'FOOTER_SERVICE_REMOVE';
export const getCarDetailsPortDataAsArray = createSelector(
    getSelfPayYMMCopy,
    getSelfPayRadioIdCopy,
    getIsSelfPayRadioClosed,
    getRemoveOldRadioId,
    getTrialYMMCopy,
    getTrialRadioIdCopy,
    (selfPayYMMCopy, selfPayRadioIdCopy, isSelfPayClosed, removeOldRadioId, trialYMMCopy, trialRadioIdCopy) => {
        return [
            {
                type: 'car',
                ymm: selfPayYMMCopy,
                radioId: selfPayRadioIdCopy,
                footer: setFooterMessage(isSelfPayClosed, removeOldRadioId),
            },
            { type: 'car', ymm: trialYMMCopy, radioId: trialRadioIdCopy },
        ];
    }
);
export const getSubscriptionDetailsPortDataAsArray = createSelector(
    getTrialPlanPackageNameCopyWithoutPlatform,
    getSelfPayPlanPackageNameCopyWithoutPlatform,
    getTrialRadioAccountSubscriptionFirstPlanEndDateFormatted,
    (trialPackageName, selfPayPackageName, trialEndDate) => {
        return [
            { type: 'subscription', title: trialPackageName, trialEndDate },
            { type: 'subscription', title: selfPayPackageName, subResumeDate: trialEndDate, footer: 'FOOTER_REMAINING_DAYS' },
        ];
    }
);
export const getSubscriptionAfterTrialDetails = createSelector(
    getSelfPayPlanPackageNameCopyWithoutPlatform,
    getTrialYMMCopy,
    getTrialRadioIdCopy,
    getTrialRadioAccountSubscriptionFirstPlanEndDateFormatted,
    (selfPayPlanPackageNameCopyWithoutPlatform, trialYMMCopy, trialRadioIdCopy, trialEndDate) => ({
        title: selfPayPlanPackageNameCopyWithoutPlatform,
        trialYmm: trialYMMCopy,
        trialRadioId: trialRadioIdCopy,
        trialEndDate,
    })
);
export const getPaymentTypeFromAccount = createSelector(getHasNoActiveCardOnFile, getAccountIsPaymentTypeInvoice, (hasNoActiveCard, isInvoice) =>
    isInvoice ? 'invoice' : !hasNoActiveCard ? 'creditCard' : 'none'
);
export const getQuoteDataForSP = createSelector(
    getQuote,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getDateFormat,
    getLanguage,
    (quote, packageDescriptions, dateFormat, lang) => {
        const { currentQuote, futureQuote, promoRenewalQuote, renewalQuote } = quote || {};
        return {
            ...(currentQuote && {
                currentCharges: {
                    totalDue: currentQuote.currentBalance <= 0 ? 0 : currentQuote.currentBalance,
                },
            }),
            ...(futureQuote && {
                futureCharges: {
                    totalDue: futureQuote.totalAmount,
                    fees: futureQuote.fees,
                    taxes: futureQuote.taxes,
                    totalDueOnStartDate: futureQuote.totalAmount,
                    planPricePerTerm: futureQuote.details?.[0]?.priceAmount,
                    startDate: formatDate(futureQuote.details?.[0]?.startDate, dateFormat, lang),
                    planTermLength: futureQuote.details?.[0]?.termLength,
                    planName: getPackageNameWithoutPlatform(packageDescriptions?.[futureQuote.details?.[0]?.packageName]?.name, futureQuote.details?.[0]?.packageName),
                    isProrated: futureQuote.isProrated,
                    isPromo: futureQuote.details?.[0]?.type === 'PROMO',
                },
            }),
            ...(promoRenewalQuote && {
                promoRenewalCharges: {
                    totalDue: promoRenewalQuote.totalAmount,
                    fees: promoRenewalQuote.fees,
                    taxes: promoRenewalQuote.taxes,
                    totalDueOnStartDate: promoRenewalQuote.totalAmount,
                    planPricePerTerm: promoRenewalQuote.details?.[0]?.priceAmount,
                    startDate: formatDate(promoRenewalQuote.details?.[0]?.startDate, dateFormat, lang),
                    planTermLength: promoRenewalQuote.details?.[0]?.termLength,
                    planName: getPackageNameWithoutPlatform(
                        packageDescriptions?.[promoRenewalQuote.details?.[0]?.packageName]?.name,
                        promoRenewalQuote.details?.[0]?.packageName
                    ),
                    isProrated: promoRenewalQuote.isProrated,
                },
            }),
            ...(renewalQuote && {
                renewalCharges: {
                    totalDue: renewalQuote.totalAmount,
                    fees: renewalQuote.fees,
                    taxes: renewalQuote.taxes,
                    totalDueOnStartDate: renewalQuote.totalAmount,
                    planPricePerTerm: renewalQuote.details?.[0]?.priceAmount,
                    startDate: formatDate(renewalQuote.details?.[0]?.startDate, dateFormat, lang),
                    planTermLength: renewalQuote.details?.[0]?.termLength,
                    planName: getPackageNameWithoutPlatform(packageDescriptions?.[renewalQuote.details?.[0]?.packageName]?.name, renewalQuote.details?.[0]?.packageName),
                    isProrated: renewalQuote.isProrated,
                },
            }),
        };
    }
);

export const getHideSPQuoteInitially = createSelector(getIsCanadaMode, (isCanada) => !isCanada);
export const getShowRateVersionOfChargeAgreement = createSelector(getIsQuebec, (isQuebec) => isQuebec);

export const getShowPlatformChangeForSP = createSelector(
    getSelectedSelfPaySubscriptionFromActiveOrClosed,
    getTrialRadioAccountSubscriptionRadioService,
    (selfPaySubscription, trialRadioService) => {
        const selfPayIsSirius = isRadioPlatformSirius(selfPaySubscription?.radioService?.radioId ?? selfPaySubscription?.radioService?.last4DigitsOfRadioId);
        const trialRadioIsSirius = isRadioPlatformSirius(trialRadioService?.radioId ?? trialRadioService?.last4DigitsOfRadioId);
        const packageIsSelect = packageTypeIsSelect(selfPaySubscription?.plans?.[0]?.packageName);
        // check if one of the platforms is Sirius but not both
        const isSiriusAndPlatformDiscrepancy = [selfPayIsSirius, trialRadioIsSirius].includes(true) && selfPayIsSirius !== trialRadioIsSirius;
        return isSiriusAndPlatformDiscrepancy && packageIsSelect ? true : false;
    }
);
// closed radios do not show the correct previous plan information (SMS issues), so the diffPackageName must be implied (hardcoding it here).
// TODO: this problem with sms might be fixed, evaluate if this will need to be changed at that time
export const getPlatformChangeDataForSP = createSelector(getSelfPayPlanPackageName, (packageName) => ({
    currentPackageName: packageName,
    diffPackageName: getPlatformFromPackageName(packageName) === PackagePlatformEnum.Sirius ? '1_' + packageName : packageName.match(/_(.*)/)?.[1],
}));

// TODO: Current price increase requirement will be only for MSRP and MRD, but this condition could change in the future. The logic is temporary
export const getDisplayPriceChangeMessage = createSelector(
    getSelectedOfferPriceChangeMessagingType,
    getSelectedOfferTermLength,
    getFirstAccountPlanChangeMessagingType,
    getIsModeServicePortability,
    getQuoteIsMilitary,
    (offerMessagingType, offerTermLength, planMessagingType, isModeSP, isMilitary) => {
        const validTypes = ['MSRP', 'MRD'];
        const messagingType = offerMessagingType || planMessagingType;
        const priceChangeMessagingTypeFeatureFlag = (validTypes.includes(offerMessagingType) && offerTermLength === 1) || (validTypes.includes(planMessagingType) && isModeSP);
        const priceChangeMessagingType = isMilitary ? `${messagingType}_MILITARY` : messagingType;
        return { priceChangeMessagingTypeFeatureFlag, priceChangeMessagingType };
    }
);
