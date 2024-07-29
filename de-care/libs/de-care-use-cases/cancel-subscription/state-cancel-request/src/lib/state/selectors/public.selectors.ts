import { createSelector } from '@ngrx/store';
import { getLeadOffers, getCompatibleOffers, getPresentmentTestCell } from '@de-care/domains/offers/state-offers';
import {
    yourCurrentPlan,
    getSubscriptionId,
    getCancelReason,
    getSelectedOffer,
    getSelectedGridPackageName,
    getPreSelectedPlanIsEnabled,
    getCurrentSubscription,
    getCancelInterstitalAdobeFlagValue,
    getCurrentSubscriptionHasSatellite,
    getCurrentSubscriptionBaseFollowOnPlanSummary,
} from './state.selectors';
import {
    getIsAdvantageOffer,
    getHighestSavings,
    getSelectedOfferType,
    getGridOffers,
    getGridOffersWithOutCurrentPlan,
    getSubscriptionIsEligibleForPreSelectedOffer,
    getMusicShowCaseOfferIsAvailable,
    getMonthlyMusicShowCaseOffer,
    getStreamingPlatinumOfferIsAvailable,
    getMonthlyStreamingPlatinumOffer,
    getCanShowPriceChangeMessage,
    getCurrentOfferPriceChangeMessagingType,
} from './offers.selectors';
import {
    removeXMPreface,
    sortChoiceGenre,
    isPlatinum,
    isPlatinumFamilyFriendly,
    isMusicAndEntertainment,
    isMusicAndEntertainmentFamilyFriendly,
    isMusicShowcase,
    isNewsSportsAndTalk,
} from '../../helpers';
import { getFirstAccountSubscriptionFirstPlanPackageName, getIsQuebec, getPvipSubscriptionsFromAccount, getIsCanada } from '@de-care/domains/account/state-account';
import { selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getModifySubscriptionCompatibleOptionsForCancelBySubscriptionId } from '@de-care/domains/account/state-management';
import { getQuoteIsMilitary } from '@de-care/domains/quotes/state-quote';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export { getPlanIsSelectedFromGrid } from './state.selectors';

export const getTestExperienceFlags = createSelector(getPresentmentTestCell, getCurrentSubscriptionHasSatellite, (testCellValue, hasSatellite) => {
    const value = testCellValue?.replace(' ', '')?.toLowerCase();
    const testExperienceflags = { testOfferExperince: false, alwaysCancelOnline: false };
    if (!hasSatellite) {
        return testExperienceflags;
    }
    switch (value) {
        case '4stt1':
            return { ...testExperienceflags, alwaysCancelOnline: true };
        case '4stt2':
            return { ...testExperienceflags, testOfferExperince: true };
        case '4stt3':
            return { ...testExperienceflags, testOfferExperince: true, alwaysCancelOnline: true };
        default:
            return testExperienceflags;
    }
});

/* Offers */
export const getCancelOffersRequest = createSelector(getSubscriptionId, getCancelReason, (subscriptionId, cancelReason) => ({ subscriptionId, cancelReason }));
export const getOffersAreAvailable = createSelector(getLeadOffers, (offers) => offers.length > 0);
// TODO: remove this selector after choice has been added to the new multi-offer component
export const getMultiPackageData = createSelector(getLeadOffers, getCompatibleOffers, yourCurrentPlan, (leadOffers, compatibleOffers, currentPlan) => {
    return {
        eligiblePackages: leadOffers.map((offer) => ({
            ...offer,
        })),
        additionalEligiblePackages: [],
        currentPackageName: currentPlan ? currentPlan.packageName : null,
        bestPackages: leadOffers.filter((offer) => offer.bestPackage).map((offer) => offer.packageName),
    };
});
export const getMultiOfferSelectionData = createSelector(
    getLeadOffers,
    yourCurrentPlan,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (offers, currentPlan, offerDescription) => {
        const mainPackageData = offers.map((offer) => {
            return {
                isBestPackage: offer.bestPackage,
                isSamePackage: offer.packageName === currentPlan?.packageName,
                planCode: offer.planCode,
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
        };
    }
);
export const getOfferTypeForOfferDetails = createSelector(getIsAdvantageOffer, (isAdvantageOffer) =>
    isAdvantageOffer ? { offerType: 'ADVANTAGE' } : { offerType: 'SELF_PAY' }
);
export const getSavingsInfo = createSelector(getHighestSavings, getSelectedOfferType, (savings, offerType) => ({
    savings,
    offerType,
}));
export const getSelectedPlanCodeAndPrice = createSelector(getSelectedOffer, (offer) => ({ planCode: offer?.planCode, price: offer?.price }));
export const getNumGridOffers = createSelector(getGridOffers, (offers) => offers?.length);
export const getNumGridOffersWithOutCurrentPlan = createSelector(getGridOffersWithOutCurrentPlan, (offers) => offers?.length);
export const getGridSelectionVM = createSelector(
    getGridOffers,
    getGridOffersWithOutCurrentPlan,
    getTestExperienceFlags,
    getSelectedOffer,
    yourCurrentPlan,
    (offers, offersWithoutCurrentPlan, testExperience, selectedOffer, currentPlan) => {
        const offersBasedOnTestFlag = testExperience?.testOfferExperince ? offersWithoutCurrentPlan : offers;
        return offersBasedOnTestFlag
            ? {
                  planSelectionData: {
                      packages: offersBasedOnTestFlag,
                      selectedPackageName: selectedOffer?.packageName,
                      leadOfferEndDate: selectedOffer?.planEndDate,
                      leadOfferPackageName: selectedOffer?.packageName,
                      currentPlanIndex: 0,
                  },
                  testOfferExperience: testExperience?.testOfferExperince,
                  currentPlanName: currentPlan?.packageName,
              }
            : null;
    }
);
export const getOfferGridVM = createSelector(
    getGridOffers,
    getGridOffersWithOutCurrentPlan,
    getTestExperienceFlags,
    getIsQuebec,
    (offers, offersWithoutCurrentPlan, testExperience, isQuebec) => {
        const offersBasedOnTestFlag = testExperience?.testOfferExperince ? offersWithoutCurrentPlan : offers;
        return offersBasedOnTestFlag
            ? {
                  offersData: offersBasedOnTestFlag.map((offer) => ({
                      pricePerMonth: offer.type === 'TRIAL_EXT' ? offer.msrpPrice : offer.pricePerMonth,
                      mrdEligible: offer.mrdEligible,
                      msrpPrice: offer.msrpPrice,
                      isPromo: offer.type.includes('PROMO'),
                      price: offer.price,
                      termLength: offer.termLength,
                      retailPrice: offer.retailPrice,
                      type: offer.type,
                  })),
                  testOfferExperience: testExperience?.testOfferExperince,
                  withOutFees: isQuebec,
                  packageNames: offersBasedOnTestFlag.map((p) => p.parentPackageName || p.packageName),
                  planCodes: offersBasedOnTestFlag.map((p) => p.planCode),
                  // featuresIndex for the purposes of the A/B test is always the current plan. This may change if the plan grid is implemented permanently
                  featuresIndex: 0,
              }
            : null;
    }
);

export const getPlanCodeFromSelectedGridPackageName = createSelector(
    getLeadOffers,
    getSelectedGridPackageName,
    (offers, packageName) => offers?.find((offer) => offer?.packageName === packageName)?.planCode
);
export const getIsSelectedGridPackageChoice = createSelector(getSelectedGridPackageName, (packageName) => packageName?.includes('CHOICE'));
export const getChoiceGenrePackageOptions = createSelector(getLeadOffers, (offers) =>
    offers
        .filter((offer) => offer?.parentPackageName?.includes('CHOICE'))
        .map((offer) => offer?.packageName)
        .map(removeXMPreface)
        .sort(sortChoiceGenre)
);

export const getCurrentSubscriptionIsStreamingOnly = createSelector(getCurrentSubscription, (currentSubscription) => {
    return currentSubscription?.streamingService?.id && !currentSubscription?.radioService?.id;
});

// Enable grid dpending only on the current subscription. Target gird flag is removed
export const getCancelOfferGridFlagValue = createSelector(
    getFirstAccountSubscriptionFirstPlanPackageName,
    getCurrentSubscriptionIsStreamingOnly,
    (packageName, isStreamingOnly) =>
        isStreamingOnly ||
        isPlatinum(packageName) ||
        isPlatinumFamilyFriendly(packageName) ||
        isMusicAndEntertainment(packageName) ||
        isMusicAndEntertainmentFamilyFriendly(packageName) ||
        isMusicShowcase(packageName) ||
        isNewsSportsAndTalk(packageName)
            ? { flag: { grid: true, hero: false } }
            : { flag: { grid: false, hero: true } }
);

// Enable pre selected plan when only music show case is available and not streaming platinum
export const getEnablePreSelectedPlan = createSelector(
    getPreSelectedPlanIsEnabled,
    getSubscriptionIsEligibleForPreSelectedOffer,
    getMusicShowCaseOfferIsAvailable,
    getStreamingPlatinumOfferIsAvailable,
    (preSelectedPlanIsEnabled, subscriptionEligibleForPreSelected, musicShowCaseIsAvailable, streamingPlatinumIsAvailable) =>
        preSelectedPlanIsEnabled && subscriptionEligibleForPreSelected && !streamingPlatinumIsAvailable && musicShowCaseIsAvailable
);

export const getEnablePreSelectedSecondPlan = createSelector(
    getPreSelectedPlanIsEnabled,
    getStreamingPlatinumOfferIsAvailable,
    (preSelectedPlanIsEnabled, streamingPlatinumIsAvailable) => preSelectedPlanIsEnabled && streamingPlatinumIsAvailable
);

// If we have both monthly show case and streaming platinum. streaming platinum would take precedence.
export const getPreSelectedOfferPlanCodeAndPrice = createSelector(getMonthlyMusicShowCaseOffer, getMonthlyStreamingPlatinumOffer, (musicShowcaseOffer, streamingOffer) => {
    if (streamingOffer?.length > 0) {
        return {
            planName: 'Streaming Platinum',
            price: streamingOffer[0].price,
        };
    }
    if (musicShowcaseOffer?.length > 0) {
        return {
            planName: musicShowcaseOffer[0].planCode?.split('-')[0]?.trim(),
            price: musicShowcaseOffer[0].price,
        };
    }
    return {};
});

export const getPreSelectedOfferDetailsForTracking = createSelector(getMonthlyMusicShowCaseOffer, getMonthlyStreamingPlatinumOffer, (musicShowcaseOffer, platinumOffer) => {
    const musicShowcase =
        musicShowcaseOffer?.length > 0
            ? { planCode: musicShowcaseOffer[0].planCode, packageName: musicShowcaseOffer[0].packageName, price: musicShowcaseOffer[0].price }
            : null;
    const musicPlatinum = platinumOffer?.length > 0 ? { planCode: platinumOffer[0].planCode, packageName: platinumOffer[0].packageName, price: platinumOffer[0].price } : null;
    return musicPlatinum || musicShowcase;
});

export const getSelectedOfferIsSelfPaid = createSelector(getSelectedOfferType, (offerType) => offerType === 'SELF_PAY' || offerType === 'SELF_PAID');
export const getCurrentPlanTermLength = createSelector(getSelectedOffer, (selectedOffer) => selectedOffer?.termLength);
export const isPlusFeesNoteRequired = createSelector(getIsQuebec, (isQuebec) => isQuebec);
export const getContainsVipSubscription = createSelector(getFirstAccountSubscriptionFirstPlanPackageName, (packageName) => packageName?.includes('_VIP'));
export const getVipIncludedButNotSelected = createSelector(
    getContainsVipSubscription,
    getSelectedGridPackageName,
    (containsVip, selected) => containsVip && !selected?.includes('_VIP')
);

export const getSubscriptionCancelOptions = (subscriptionId: number | string) =>
    createSelector(getModifySubscriptionCompatibleOptionsForCancelBySubscriptionId(subscriptionId), getTestExperienceFlags, (options, flags) => ({
        ...options,
        showCancelOnline: options?.showCancelOnline || flags?.alwaysCancelOnline,
        showCancelViaChat: options?.showCancelViaChat && !flags?.alwaysCancelOnline,
    }));

export const getEnabledCancelInterstitialPage = createSelector(
    getCancelInterstitalAdobeFlagValue,
    getCurrentSubscriptionIsStreamingOnly,
    (interstitialAdobeFlag, isStreamingOnly) => interstitialAdobeFlag?.flag?.interstitial && isStreamingOnly
);

export const getCancelStepsFlags = (subscriptionId) =>
    createSelector(
        getEnablePreSelectedPlan,
        getEnablePreSelectedSecondPlan,
        getEnabledCancelInterstitialPage,
        getOffersAreAvailable,
        getIsCanada,
        getSubscriptionCancelOptions(subscriptionId),
        (enablePreselectedPlanStep, enablePreSelectedSecondPlan, enableInterstitalStep, offersAreAvailable, isCanada, cancelOptions) => ({
            enableCancelSummary: cancelOptions?.showCancelOnline && !offersAreAvailable && !isCanada,
            enabledSpecialOfferStep: enablePreselectedPlanStep || enablePreSelectedSecondPlan,
            enableInterstitalStep,
        })
    );

export const getToSkipStepsAndGoToCancelSummary = createSelector(getPvipSubscriptionsFromAccount, (subscriptions) => {
    return subscriptions?.length > 1;
});

export const getSubscriptionWithTrialAndFollowon = createSelector(getCurrentSubscription, (subscription) => {
    return subscription.plans?.some((plan) => plan.type === 'TRIAL') && subscription?.followonPlans?.length > 0;
});

export const getTrialPlanFromCurrentSubscription = createSelector(getCurrentSubscription, (sub) => sub?.plans?.find((plan) => plan.type === 'TRIAL'));

export const getCurrentPlanSummary = createSelector(
    yourCurrentPlan,
    getSubscriptionWithTrialAndFollowon,
    getCurrentSubscriptionBaseFollowOnPlanSummary,
    (currentPlan, hasSubscriptionWithTrialAndFollowOn, followOnPlan) => ({
        ...currentPlan,
        hasSubscriptionWithTrialAndFollowOn,
        followOnPlan,
    })
);

export const getPriceChangeViewModel = createSelector(
    getCanShowPriceChangeMessage,
    getQuoteIsMilitary,
    getCurrentOfferPriceChangeMessagingType,
    (priceChangeMessagingTypeFeatureFlag, isQuoteMilitary, currentOfferPriceChangeType) => {
        return {
            priceChangeMessagingTypeFeatureFlag,
            priceChangeMessagingType: priceChangeMessagingTypeFeatureFlag ? `${currentOfferPriceChangeType}${isQuoteMilitary ? '_MILITARY' : ''}` : '',
        };
    }
);

export const getCurrentSubscriptionIsPvip = createSelector(
    getCurrentSubscription,
    (subscription) => subscription?.plans?.map((plan) => plan.packageName)?.filter((packageName) => packageName?.includes('_VIP')).length > 0
);

export const getAllowGoBackToOffers = createSelector(
    // Link to go back to offers disabled for accouts with 2 PVIP plans.
    getPvipSubscriptionsFromAccount,
    getCurrentSubscriptionIsPvip,
    (subscriptions, selectedSubscriptionIsPvip) => !(subscriptions?.length > 1 && selectedSubscriptionIsPvip)
);

export const getPlanComparisonGridData = createSelector(getLeadOffers, selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId, (allOffers, allPackageDescriptions) => {
    const plans = {};
    const offers = allOffers.map((offer) => ({
        packageCodeName: offer.packageName,
        packageName: allPackageDescriptions[offer.packageName]?.name,
        planCode: offer.planCode,
        channelCount: allPackageDescriptions[offer.packageName]?.channels[0]?.count,
        promoTermLength: offer.termLength,
        promoPricePerMonth: offer.price,
        pricePerMonth: offer.retailPrice,
        listenOn: {
            insideTheCar: true,
            outsideTheCar: true,
        },
        channelLineupUrl: allPackageDescriptions[offer.packageName]?.channelLineUpURL,
    }));

    offers?.forEach((offer, i) => {
        plans[`plan${i + 1}`] = offer;
    });

    return {
        ...plans,
        bestValuePlanCode: null,
        features: mapFeaturesSummaryToFeatures(allOffers, allPackageDescriptions),
    };
});

function mapFeaturesSummaryToFeatures(allOffers, allPackageDescriptions) {
    const features = [];
    const capabilities = {};

    allOffers.forEach((_, index) => {
        const key = `capabilityPlan${index + 1}`;
        capabilities[key] = null;
    });

    allOffers?.forEach((offer, index) => {
        const allFeatureSummary = allPackageDescriptions[offer.packageName]?.channels[0]?.featureSummary;
        allFeatureSummary?.forEach((featureSummaryObject) => {
            const initialFeatureObj = features.find((featureSummary) => featureSummary.name === featureSummaryObject.name);
            if (!initialFeatureObj) {
                features.push({ name: featureSummaryObject.name, ...capabilities });
            }

            const featureObj = features.find((featureSummary) => featureSummary.name === featureSummaryObject.name);
            if (featureObj) {
                featureObj[`capabilityPlan${index + 1}`] = featureSummaryObject.capability;
            }
        });
    });

    return features;
}

export const getDataForPackageCards = createSelector(getLeadOffers, selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId, (offers, allPackageDescriptions) => {
    return offers?.map((offer) => {
        const fullName = allPackageDescriptions[offer.packageName]?.name;
        const platformName = /^.?Sirius |SiriusXM |XM |XMWX |WX $/g;
        const packageShortName = fullName?.replace(platformName, '');
        const features = setFeaturesForNewOfferPage(fullName);
        return {
            packageName: offer.packageName,
            packageShortName,
            pricePerMonth: offer?.pricePerMonth,
            termLength: offer?.termLength,
            retailPrice: offer?.retailPrice,
            features,
        };
    });
});

// TODO: Temporary solution. Features names should depend on MS, but this data is not available yet.
function setFeaturesForNewOfferPage(fullName: string) {
    const platformIsSirius = /^Sirius .+$/.test(fullName);
    if (fullName?.includes('Platinum')) {
        return ['Music', 'News', 'Talk', 'All Sports', 'Howard Stern'];
    } else if (fullName?.includes('Music & Entertainment')) {
        return platformIsSirius ? ['Music', 'News', 'Talk', 'Some Sports', 'Howard Stern'] : ['Music', 'News', 'Talk', 'Some Sports'];
    } else if (fullName?.includes('Music Showcase')) {
        return ['Music', 'Some News', 'Some Talk'];
    }
    return [];
}

export const getNewOfferExperienceDetails = createSelector(getDataForPackageCards, getTestExperienceFlags, (packagesData, newOffersFlags) => ({
    packagesData,
    showOnlyOneOffer: packagesData?.length === 1,
    newOffersPageEnabled: newOffersFlags?.testOfferExperince,
    cancelOnlineEnabled: newOffersFlags?.alwaysCancelOnline,
}));
