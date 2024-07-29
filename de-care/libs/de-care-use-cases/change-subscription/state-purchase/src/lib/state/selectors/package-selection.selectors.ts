import { createSelector } from '@ngrx/store';
import {
    selectChangeSubscriptionOffers,
    Offer,
    getAllDataCapableOffersAsArray,
    getAllDataCapableOffersUniqueByTerm,
    getAllNonDataCapableOffers,
    getAllDataCapableOffers,
} from '@de-care/domains/offers/state-offers';
import {
    getOffersBasedOnCurrentPlan,
    getSelectedOfferObject,
    getCurrentSubscriptionFirstPlan,
    getIsTokenMode,
    getCurrentSubscriptionIsDataOnly,
    getInfotainmentPlanCodes,
    getCurrentPlanIsTrial,
    getPlanCode,
    getCurrentSubscriptionId,
    getCurrentPlanIsTrialAndCurrentSubscriptionHasFollowOns,
    getIsCanadaMode,
} from './state.selectors';
import { getAllCurrentPlans, getAllFollowOnPlans } from './current-plan.selectors';
import { selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { selectFeature } from './feature.selectors';
import { getSelectedTermInfo } from './pick-billing-plan.selectors';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getQuoteIsMilitary } from '@de-care/domains/quotes/state-quote';
import { getAccountFirstSubscriptionRadioServiceDevicePromoCode } from '@de-care/domains/account/state-account';

function offerTypeIsTrial(type: string) {
    return type && type.toUpperCase() === 'TRIAL';
}

function offerTypeIsAPromo(offer: Offer) {
    return offer.type === 'PROMO' || offer.type === 'TRIAL_EXT' || offer.type === 'PROMO_MCP';
}

function isAdditionalEligiblePackage(offer: Offer, currentPackageName: string) {
    return !offer.bestPackage && !offerTypeIsAPromo(offer) && offer.packageName !== currentPackageName;
}

function customerHasInfotaimentOffer(infotainmentOfferPackageName: string, currentPlans, followOnPlans): boolean {
    const isCurrentPlanTrial = !!currentPlans?.find(({ type }) => type === 'TRIAL');
    if (isCurrentPlanTrial) {
        return !!followOnPlans?.find((followOnPlan) => followOnPlan.packageName === infotainmentOfferPackageName);
    }
    return !!currentPlans?.find((currentPlan) => currentPlan.packageName === infotainmentOfferPackageName);
}

const getCurrentSubscriptionFirstPlanPackageName = createSelector(getCurrentSubscriptionFirstPlan, (plan) => plan?.packageName);

export const getChangeSubscriptionData = createSelector(
    selectChangeSubscriptionOffers,
    getCurrentSubscriptionFirstPlanPackageName,
    (changeSubscriptionOffer, currentPackageName) => {
        const additionalEligiblePackages = changeSubscriptionOffer.other
            .filter((offer) => isAdditionalEligiblePackage(offer, currentPackageName))
            .sort((offerA, offerB) => offerA.order - offerB.order);
        if (changeSubscriptionOffer.upgrades.length === 0) {
            const eligiblePackages = changeSubscriptionOffer.other
                .filter((offer) => offer.bestPackage || offerTypeIsAPromo(offer))
                .sort((offerA, offerB) => offerA.order - offerB.order);
            const bestPackages = eligiblePackages.filter((offer) => offer.bestPackage).map((offer) => offer.packageName);
            return {
                eligiblePackages: eligiblePackages,
                additionalEligiblePackages,
                currentPackageName,
                bestPackages: bestPackages,
            };
        } else {
            const bestPackage = changeSubscriptionOffer.upgrades.find((offer) => offer.bestPackage);
            return {
                eligiblePackages: changeSubscriptionOffer.upgrades,
                additionalEligiblePackages,
                currentPackageName,
                bestPackages: bestPackage ? [bestPackage.packageName] : [],
            };
        }
    }
);

export const getMultiOfferSelectionData = createSelector(
    selectChangeSubscriptionOffers,
    getCurrentSubscriptionFirstPlanPackageName,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    getCurrentSubscriptionIsDataOnly,
    (offers, currentPackageName, offerDescription, isCurrentSubscriptionDataOnly) => {
        const additionalEligiblePackages = offers.other.filter((offer) => isAdditionalEligiblePackage(offer, currentPackageName));
        const mainOffers = offers.upgrades.length === 0 ? offers.other.filter((offer) => offer.bestPackage || offerTypeIsAPromo(offer)) : [...offers.upgrades];

        const mainPackageData = mainOffers.map((offer) => {
            return {
                isBestPackage: offer.bestPackage,
                isSamePackage: offer.packageName === currentPackageName,
                planCode: offer.planCode,
                isCurrentSubscriptionDataOnly,
                data: {
                    packageName: offerDescription[offer.planCode]?.platformPlan,
                    highlightsText: offerDescription[offer.planCode]?.details,
                    priceAndTermDescTitle: offerDescription[offer.planCode]?.priceAndTermDescTitle,
                    processingFeeDisclaimer: offerDescription[offer.planCode]?.processingFeeDisclaimer,
                    icons: offerDescription[offer.planCode]?.icons,
                    footer: offerDescription[offer.planCode]?.footer,
                    theme: offerDescription[offer.planCode]?.theme,
                },
            };
        });
        const additionalPackageData = additionalEligiblePackages.map((offer) => {
            return {
                planCode: offer.planCode,
                isSamePackage: offer.packageName === currentPackageName,
                isCurrentSubscriptionDataOnly,
                data: {
                    packageName: offerDescription[offer.planCode]?.platformPlan,
                    highlightsText: offerDescription[offer.planCode]?.details,
                    priceAndTermDescTitle: offerDescription[offer.planCode]?.priceAndTermDescTitle,
                    processingFeeDisclaimer: offerDescription[offer.planCode]?.processingFeeDisclaimer,
                    icons: offerDescription[offer.planCode]?.icons,
                    footer: offerDescription[offer.planCode]?.footer,
                    theme: offerDescription[offer.planCode]?.theme,
                },
            };
        });
        return {
            mainPackageData,
            additionalPackageData,
        };
    }
);

export const getInfotainmentOffersAreAvailable = createSelector(getAllDataCapableOffersAsArray, (offers) => offers && offers.length > 0);

export const getShouldAudioPlanSelectionBeOptional = createSelector(
    getInfotainmentOffersAreAvailable,
    getCurrentSubscriptionIsDataOnly,
    (hasInfotainmentPlans, currentSubscriptionIsDataOnly) => hasInfotainmentPlans && currentSubscriptionIsDataOnly
);

export const getIsDataOnlyTrialWithNoOfferInfoOrNoFollowOn = createSelector(
    getCurrentSubscriptionIsDataOnly,
    getCurrentPlanIsTrial,
    getInfotainmentOffersAreAvailable,
    (isDataOnly, isTrial, hasAvailableInfotainmentOffers) => isDataOnly && isTrial && !hasAvailableInfotainmentOffers
);

export const getIsTrialWithOutFollowOns = createSelector(getCurrentPlanIsTrial, getAllFollowOnPlans, (isTrial, followOn) => isTrial && followOn.length === 0);

const getCheaperAudioOffer = createSelector(getAllNonDataCapableOffers, (allAudioOffers) =>
    allAudioOffers?.reduce((prevOffer, currentOffer) => {
        if (!prevOffer || prevOffer.price > currentOffer.price) {
            return currentOffer;
        }
        return prevOffer;
    }, null)
);

const getCheaperDataOffer = createSelector(getAllDataCapableOffers, (allDataOffers) =>
    allDataOffers?.reduce((prevOffer, currentOffer) => {
        if (!prevOffer || prevOffer.retailPrice > currentOffer.retailPrice) {
            return currentOffer;
        }
        return prevOffer;
    }, null)
);

export const getPriceForCheapestAudioOffer = createSelector(getCheaperAudioOffer, (offer) => offer?.price);

export const getPriceForCheapestDataOffer = createSelector(getCheaperDataOffer, (offer) => offer?.retailPrice);

export const getTermLengthForCheapestAudioOffer = createSelector(getCheaperAudioOffer, (offer) => offer?.termLength);

export const getTypeForCheapestAudioOffer = createSelector(getCheaperAudioOffer, (offer) => offer?.type);

// Implement the logic handling this from the MicroService.
export const getIsBrandedWithOneOfPromo = createSelector(getAccountFirstSubscriptionRadioServiceDevicePromoCode, (promo) =>
    ['SM3MOAA', 'TRUCK3MOAA', 'FLEETAUDTRIAL3', '11464', '0178'].includes(promo)
);

export const getHeroTitleKey = createSelector(
    getIsDataOnlyTrialWithNoOfferInfoOrNoFollowOn,
    getIsTrialWithOutFollowOns,
    getTypeForCheapestAudioOffer,
    getIsBrandedWithOneOfPromo,
    (isDataOnlyTrialWithNoOfferInfoOrNoFollowOn, isTrialWithoutFollowOns, cheapestOfferType, isBrandedWithOneOfPromo) => {
        if (isBrandedWithOneOfPromo) {
            return 'START_LISTENING_TODAY';
        } else if (cheapestOfferType === 'TRIAL_EXT') {
            return 'MORE_OF';
        } else if (isDataOnlyTrialWithNoOfferInfoOrNoFollowOn || isTrialWithoutFollowOns) {
            return 'GET_AS_LITTLE';
        } else {
            return 'DEFAULT';
        }
    }
);

export const getShouldDisplayMarketingPromoCodeForm = createSelector(
    getIsCanadaMode,
    getIsTrialWithOutFollowOns,
    (isCanadaMode, isTrialWithoutFollowOns) => isCanadaMode && isTrialWithoutFollowOns
);

export const getHeroInfo = createSelector(
    getHeroTitleKey,
    getPriceForCheapestAudioOffer,
    getPriceForCheapestDataOffer,
    getTermLengthForCheapestAudioOffer,
    (heroTitleKey, cheapestPrice, cheapestDataPrice, cheapestTermLength) => ({
        heroTitleKey,
        cheapestPrice,
        cheapestDataPrice,
        cheapestTermLength,
    })
);

export const getInfotainmentOffers = createSelector(
    getAllDataCapableOffersUniqueByTerm,
    getAllCurrentPlans,
    getAllFollowOnPlans,
    (dataCapableOffers, currentPlans, followOnPlans) =>
        dataCapableOffers.map((offer) => ({
            ...offer,
            customerHasThisPlan: customerHasInfotaimentOffer(offer.packageName, currentPlans, followOnPlans),
        }))
);

const getInfotainmentOffersSorted = createSelector(getInfotainmentOffers, (offers) => offers.sort((a, b) => a.order - b.order));

export const getInfotainmentPlansForForm = createSelector(
    getInfotainmentOffersSorted,
    getCurrentSubscriptionFirstPlanPackageName,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (offers, currentPackageName, offerDescription) => {
        return offers.map((offer) => {
            const desc = offerDescription[offer.planCode];
            return {
                isSamePackage: offer.packageName === currentPackageName,
                planCode: offer.planCode,
                data: {
                    platformPlan: desc?.platformPlan,
                    longDescription: desc?.longDescription,
                    priceAndTermDescTitle: desc?.priceAndTermDescTitle,
                    processingFeeDisclaimer: desc?.processingFeeDisclaimer,
                    packageFeatures: desc?.packageFeatures,
                    theme: desc?.theme,
                    presentation: desc?.presentation,
                },
                currentlyHave: offer.customerHasThisPlan,
                isBundlePlan: offer.bundled,
                bundleSavingsAmount: offer.bundledSavingPrice,
                bundleSubPackageNames: offer.bundleSubPackageNames,
                packageName: offer.packageName,
            };
        });
    }
);

export const getAllPackagesNames = createSelector(getChangeSubscriptionData, (data) => {
    let allPackages: Offer[] = [];
    if (data.additionalEligiblePackages) {
        allPackages = allPackages.concat(data.additionalEligiblePackages);
    }
    if (data.eligiblePackages) {
        allPackages = allPackages.concat(data.eligiblePackages);
    }
    return allPackages.map((pkg) => pkg.packageName);
});

export const getSelectedOffer = createSelector(getSelectedOfferObject, (foundOffer) => ({
    packageName: foundOffer ? foundOffer.packageName : null,
    isTrial: foundOffer && offerTypeIsTrial(foundOffer.type),
    endDate: foundOffer && foundOffer.planEndDate,
    priceChangeMessagingType: foundOffer?.priceChangeMessagingType,
}));

export const getIsDataOnlyAndInfotainmentsAvailable = createSelector(
    getCurrentSubscriptionIsDataOnly,
    getInfotainmentOffersAreAvailable,
    (accountIsDataOnly, infotainmentOffersAvailable) => accountIsDataOnly && infotainmentOffersAvailable
);

export const getCanContinueWithoutSelectAnyInfotainment = createSelector(
    getCurrentSubscriptionIsDataOnly,
    getSelectedOffer,
    getInfotainmentPlanCodes,
    (currentSubscriptionIsDataOnly, selectedAudioOffer, selectedInfotainments) =>
        !currentSubscriptionIsDataOnly || !!selectedAudioOffer?.packageName || selectedInfotainments.length > 0
);

export const getShouldInfotainmentSelectionBeOptional = createSelector(
    getCurrentSubscriptionIsDataOnly,
    getSelectedOffer,
    (currentSubscriptionIsDataOnly, selectedAudioOffer) => !currentSubscriptionIsDataOnly || !!selectedAudioOffer?.packageName
);

export const displayDefaultMultiPackageSelectionError = createSelector(
    getCurrentSubscriptionIsDataOnly,
    getInfotainmentOffersAreAvailable,
    (currentSubscriptionIsDataOnly, infotainmentOffersAvailable) => !currentSubscriptionIsDataOnly || infotainmentOffersAvailable
);

export const getCanSkipMultipackageSelectionStep = createSelector(
    getIsDataOnlyAndInfotainmentsAvailable,
    getOffersBasedOnCurrentPlan,
    getCurrentPlanIsTrialAndCurrentSubscriptionHasFollowOns,
    (isDataOnlyAndInfotainmentsAvailable, currentOffers, isTrialAndHasFollowOns) => (currentOffers.length > 1 && isTrialAndHasFollowOns) || isDataOnlyAndInfotainmentsAvailable
);

export const shouldPreSelectFirstPackage = createSelector(
    getIsTokenMode,
    getCurrentSubscriptionIsDataOnly,
    (isTokenMode, accountIsDataOnly) => isTokenMode && !accountIsDataOnly
);

export const resetMultiOfferSelectionForm = createSelector(getPlanCode, (planCode) => !planCode);

export const getMarketingPromoCode = createSelector(selectFeature, (state) => state.marketingPromoCode);

const getTaskFromQueryParams = createSelector(getNormalizedQueryParams, ({ task }) => task);

export const getLoadOffersPayload = createSelector(getTaskFromQueryParams, getMarketingPromoCode, getCurrentSubscriptionId, (task, marketingPromoCode, subscriptionId) => ({
    ...(task && { task }),
    ...(marketingPromoCode && { marketingPromoCode }),
    subscriptionId: +subscriptionId,
}));

export const getCurrentOfferPriceChangeMessagingType = createSelector(getSelectedOffer, (offer) => offer?.priceChangeMessagingType);
export const getCanShowPriceChangeMessage = createSelector(getSelectedOfferObject, (offer) => {
    const validMessageTypes = ['MSRP', 'MRD'];
    return validMessageTypes.includes(offer?.priceChangeMessagingType) && offer?.termLength === 1;
});

export const getPriceChangeViewModel = createSelector(
    getCanShowPriceChangeMessage,
    getQuoteIsMilitary,
    getCurrentOfferPriceChangeMessagingType,
    getSelectedTermInfo,
    (priceChangeMessagingTypeFeatureFlag, isQuoteMilitary, currentOfferPriceChangeType, selectedTerm) => {
        return {
            priceChangeMessagingTypeFeatureFlag: priceChangeMessagingTypeFeatureFlag && !selectedTerm.isAnnual,
            priceChangeMessagingType: priceChangeMessagingTypeFeatureFlag ? `${currentOfferPriceChangeType}${isQuoteMilitary ? '_MILITARY' : ''}` : '',
        };
    }
);
