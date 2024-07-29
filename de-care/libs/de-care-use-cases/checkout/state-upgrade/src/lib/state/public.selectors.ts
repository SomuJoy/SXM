import { createSelector } from '@ngrx/store';
import { getAccountSubscriptionForRadioId, getCurrentLocale, getSelectedRadioId, getTransactionData } from './selectors';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import {
    getAllOffers,
    getIsRefreshAllowed,
    getSelectedOffer,
    getSelectedOfferDealCopy,
    getSelectedOfferOfferInfoHero,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedPackageName,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getIsCanada, getIsQuebec } from '@de-care/domains/account/state-account';
import { getAmzClientId, getOACUrl } from '@de-care/shared/state-settings';
import { PackagePlatformEnum } from '@de-care/domains/offers/state-offers';
import { getSessionInfoId } from '@de-care/domains/utility/state-environment-info';

export {
    getPaymentMethodOptionsViewModel,
    getSelectedPaymentMethodSummaryViewModel,
    getShouldIncludeNuCaptcha as getDisplayNuCaptcha,
} from '@de-care/de-care-use-cases/checkout/state-common';

function mapSubscriptionPlansToSummary(
    subscription,
    allPackageDescriptions
): {
    name: string;
    price: number;
    isAnnual: boolean;
}[] {
    return [
        ...(subscription?.plans?.map((plan) => ({
            name: allPackageDescriptions[plan.packageName].name,
            price: plan.price,
            isAnnual: plan.termLength > 0 && plan.termLength % 12 === 0,
        })) || []),
        ...(subscription?.followonPlans?.map((plan) => ({
            name: allPackageDescriptions[plan.packageName].name,
            price: plan.price,
            isAnnual: plan.termLength > 0 && plan.termLength % 12 === 0,
        })) || []),
    ];
}

function getPlatformFromPackageName(packageName: string): PackagePlatformEnum {
    if (packageName.startsWith('1_')) {
        return PackagePlatformEnum.Xm;
    } else if (packageName.startsWith('SXM_') || packageName.startsWith('3_')) {
        return PackagePlatformEnum.Siriusxm;
    } else {
        return PackagePlatformEnum.Sirius;
    }
}

function getShortPackagePackageUpgradeName(value: string, packageName: string, platform: string, locale = 'en-US'): any {
    if (!value || value.length === 0) {
        return value;
    }
    if (!packageName || packageName.length === 0) {
        return value;
    }

    const words = value.split(' ');
    const hasPlatform = words.findIndex((p: string) => p.toLowerCase() === platform.toLowerCase());

    if (hasPlatform >= 0 && locale === 'fr_CA') {
        words.splice(hasPlatform - 1, 2);
        return words.join(' ');
    } else if (hasPlatform >= 0) {
        words.splice(hasPlatform, 1);
        return words.join(' ').replace(' Add-on', '');
    }
}
export const getShouldIncludePlusFees = createSelector(getIsCanada, getIsQuebec, (isCanada, isQuebec) => {
    return isCanada && !isQuebec;
});

function mapSubscriptionCurrentPlansToSummary(
    subscription,
    allPackageDescriptions
): {
    name: string;
    price: number;
    isAnnual: boolean;
}[] {
    return [
        ...(subscription?.plans?.map((plan) => ({
            name: allPackageDescriptions[plan.packageName].name,
            price: plan.price / plan.termLength,
        })) || []),
    ];
}

export const getSelectedOfferViewModel = createSelector(
    getSelectedOfferOfferInfoHero,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferDealCopy,
    (hero, legalCopy, offerDescriptionCopy, dealCopy) => ({
        hero,
        legalCopy,
        dealCopy,
        offerDescriptionCopy,
    })
);
export const getRadioInfoForSelectedDeviceViewModel = createSelector(
    getAccountSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (subscription, allPackageDescriptions) => mapSubscriptionPlansToSummary(subscription, allPackageDescriptions)
);

export const getRadioAndCurentPlanInfoForSelectedDeviceViewModel = createSelector(
    getAccountSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (subscription, allPackageDescriptions) => mapSubscriptionCurrentPlansToSummary(subscription, allPackageDescriptions)
);

const getFirstPlanForSubscriptionForRadioId = createSelector(getAccountSubscriptionForRadioId, (subscription) => subscription?.plans?.[0]);

export const getSelectedOfferDetailsCopyModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getFirstPlanForSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getCurrentLocale,
    getRadioInfoForSelectedDeviceViewModel,
    getSelectedOffer,
    (legalCopy, currentPlan, packageDescriptions, locale, radioInfoForSelectedDeviceModel, offer) => {
        const packageDescriptionInfo = packageDescriptions[currentPlan.packageName];
        const offerPrice = radioInfoForSelectedDeviceModel?.[0]?.isAnnual ? (Math.round(offer.price * 12 * 100) / 100.0).toFixed(2) : offer.price.toFixed(2);
        return legalCopy
            ?.replace(/{{currentPackageRetailPriceWithCents}}/g, currentPlan.price.toFixed(2))
            .replace(
                /{{shortCurrentPackageName}}/g,
                getShortPackagePackageUpgradeName(
                    packageDescriptionInfo.name,
                    packageDescriptionInfo.packageName,
                    getPlatformFromPackageName(packageDescriptionInfo.packageName),
                    locale
                )
            )
            .replace(/{{upgradePrice}}/g, offerPrice);
    }
);

export const getUpgradeSummaryViewModel = createSelector(
    getSelectedOffer,
    getSelectedPackageName,
    getFirstPlanForSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getIsQuebec,
    getRadioInfoForSelectedDeviceViewModel,
    (offer, packageName, currentPlan, packageDescriptions, isQuebec, radioInfoForSelectedDeviceModel) => {
        const packageDescriptionInfo = packageDescriptions[packageName];
        if (packageDescriptionInfo && packageDescriptionInfo.upgradeInfo) {
            const packageDiffForOffer = packageDescriptionInfo?.packageDiff?.find((packageDiff) => packageDiff.packageName === currentPlan.packageName);
            const { header, description } = currentPlan.termLength % 12 === 0 ? packageDescriptionInfo.upgradeInfo?.annual : packageDescriptionInfo.upgradeInfo?.monthly;
            const descriptions = description?.map((text) => {
                const priceAdditionalText = isQuebec ? '' : packageDescriptionInfo?.priceAdditionalText;
                const offerPrice = radioInfoForSelectedDeviceModel?.[0]?.isAnnual ? (Math.round(offer.price * 12 * 100) / 100.0).toFixed(2) : offer.price.toFixed(2);
                const currentPrice = radioInfoForSelectedDeviceModel?.[0]?.isAnnual ? offerPrice : currentPlan.price.toFixed(2);
                return text
                    .replace(/{{price}}/g, currentPrice)
                    .replace(/{{upgradePrice}}/g, offerPrice)
                    .replace(/{{priceAdditionalText}}/g, priceAdditionalText);
            });
            return {
                header,
                descriptions,
                additionalFeatures: packageDiffForOffer?.additionalChannels?.[0]?.descriptions,
            };
        }
        return null;
    }
);
export const getQuoteViewModel = createSelector(getQuote, (quote) => quote || null);
export const getConfirmationPageViewModel = createSelector(
    getSelectedRadioId,
    getQuoteViewModel,
    getSecurityQuestions,
    getTransactionData,
    getIsRefreshAllowed,
    (radioIdLastFour, quoteViewModel, securityQuestions, transactionData, isRefreshAllowed) => ({
        radioIdLastFour,
        quoteViewModel,
        isRefreshAllowed,
        listenNowViewModel: {
            subscriptionId: transactionData.subscriptionId,
            useCase: '',
        },
        registrationViewModel:
            securityQuestions?.length > 0 && transactionData?.email
                ? {
                      securityQuestions,
                      accountInfo: {
                          email: transactionData.email,
                          useEmailAsUsername: false,
                          firstName: '',
                          hasUserCredentials: false,
                          hasExistingAccount: false,
                          isOfferStreamingEligible: transactionData.isOfferStreamingEligible,
                          isEligibleForRegistration: transactionData.isEligibleForRegistration,
                          subscriptionId: transactionData.subscriptionId,
                      },
                  }
                : null,
    })
);

export const getAllPlans = createSelector(getAllOffers, (offers) => offers);
export const getSelectedPlan = createSelector(getSelectedOffer, (offers) => offers);
export const getSelectedPlanTermLength = createSelector(getSelectedOffer, (offer) => offer?.termLength);
export const getSelectedPlanPackageName = createSelector(getSelectedOffer, (offer) => offer?.packageName);
export const getSelectedPlanDealType = createSelector(getSelectedOffer, (offer) => offer?.deal?.type);

export const getOACRedirectUrl = createSelector(getOACUrl, (oacUrl) => oacUrl);
export const getSubscriptionId = createSelector(getTransactionData, (transactionData) => transactionData.subscriptionId);
export const getIsDealWithoutPartnerSiteSupportLink = createSelector(getSelectedPlanDealType, (dealType) => dealType && dealType !== 'AMZ_DOT');
export const getSelectedPlanDealIsAmazon = createSelector(getSelectedPlanDealType, (dealType) => dealType === 'AMZ_DOT');
export const getSelectedPlanDealViewModelForAmazon = createSelector(getAmzClientId, getSubscriptionId, getSessionInfoId, (clientId, subscriptionId, sessionId) => ({
    clientId,
    subscriptionId,
    sessionId,
}));
