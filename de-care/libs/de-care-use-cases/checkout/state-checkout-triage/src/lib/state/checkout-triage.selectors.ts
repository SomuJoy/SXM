import {
    CHECKOUT_CONSTANT,
    CheckoutState,
    getIsRtc,
    getPickAPlanSelectedOfferPackageName,
    getRenewalPackageOptions,
    getSelectedRenewalOfferRetailPrice,
    getSelectedRenewalPackageName,
} from '@de-care/checkout-state';
import { isBetterOffer, isOfferMCP, OfferNotAvailableReasonEnum, OfferPackage, PlanTypeEnum } from '@de-care/data-services';
import {
    getAllOffers,
    getAllOffersAsArray,
    getFirstOfferIsFallbackForNotStreamingEligible,
    OfferDetails,
    offerToOfferDetails,
    offerTypeIsSelfPay,
    selectOffer,
} from '@de-care/domains/offers/state-offers';
import {
    getCurrentOffer,
    getFlep,
    getPaymentInfo,
    getPlatformChangedFlag,
    getSelectedOffer,
    getSelectedOfferOrOffer,
    getServiceAddress,
    getUpgrade,
    PurchaseState,
    PurchaseStateConstant,
} from '@de-care/purchase-state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectFirstFollowOnOffer } from '@de-care/domains/offers/state-follow-on-offers';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getProvinceIsQuebec, getIsCanadaMode } from '@de-care/domains/customer/state-locale';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const getCheckoutState = createFeatureSelector<CheckoutState>(CHECKOUT_CONSTANT.STORE.NAME);
export const getUpsellCode = createSelector(getCheckoutState, (checkoutState) => checkoutState.upsellCode);
// Offer
export const getOfferState = createSelector(getCheckoutState, (state) => state.offer || null);
// Offer derived
export const getOffersFromOfferState = createSelector(getOfferState, (offerState) => {
    if (offerState === null) {
        return null;
    }

    return offerState.offers || null;
});
// Offer derived
export const getFirstOfferFromOfferState = createSelector(getOffersFromOfferState, (offers) => {
    if (offers === null || offers.length === 0) {
        return null;
    }

    return offers[0] || null;
});
// Offer?
export const getLeadOfferType = createSelector(getCheckoutState, (state) => {
    if (state.leadOfferType === undefined || state.leadOfferType === null || state.leadOfferType.length === 0) {
        return null;
    }

    return state.leadOfferType;
});

// Upsell
export const getSelectedUpsellState = createSelector(getCheckoutState, (state) => state.selectedOffer || null);
// Upsell derived
export const getFirstSelectedUpsell = createSelector(getSelectedUpsellState, (upsellState) => {
    if (upsellState === null || !upsellState.offers || upsellState.offers.length === 0) {
        return null;
    }

    return upsellState.offers[0] || null;
});

// Account?
export const getCheckoutAccount = createSelector(getCheckoutState, (state) => state.account || null);

export const getCheckoutAccountHasSubscription = createSelector(getCheckoutAccount, (account) => !!account && !!account.subscriptions && account.subscriptions.length > 0);
export const getFirstSubscriptionInCheckoutAccount = createSelector(getCheckoutAccount, getCheckoutAccountHasSubscription, (account, hasSubscriptions) =>
    hasSubscriptions ? account.subscriptions[0] : null
);
export const getFirstSubscriptionIdInCheckoutAccount = createSelector(getFirstSubscriptionInCheckoutAccount, (subscription) => subscription?.id || null);

export const getProgramCode = createSelector(getCheckoutState, (state) => state.programCode || null);
export const getPromoCode = createSelector(getCheckoutState, (state) => state.promoCode || null);
export const getProgramAndRenewalCode = createSelector(getCheckoutState, getProgramCode, (state, programCode) => ({ renewalCode: state.renewalCode, programCode } || {}));
export const getIsTokenizedLink = createSelector(getCheckoutState, (state) => state.isTokenizedLink || false);
export const getIsStreaming = createSelector(getCheckoutState, (state) => state.isStreaming || false);
export const getIsPromoCodeValid = createSelector(getCheckoutState, (state) => state.isPromoCodeValid || false);

export const getContinueToFallbackOffer = createSelector(getPromoCode, getIsPromoCodeValid, (promoCode, isPromoCodeValid) => promoCode && !isPromoCodeValid);
export const getPromoExtraParameters = createSelector(getPromoCode, getIsPromoCodeValid, (promoCode, isPromoCodeValid) => ({
    promoCode: isPromoCodeValid ? promoCode : null,
}));
// From purchase state
export const getUpgrades = createSelector(getCurrentOffer, getUpgrade, getPlatformChangedFlag, (originalOffer, upgradeOffers, platformChangedFlag) => {
    return {
        originalOffer,
        upgradeOffers,
        platformChangedFlag,
    };
});

// view model items below

export const getOfferOrUpsell = createSelector(getFirstOfferFromOfferState, getFirstSelectedUpsell, (firstOffer, firstSelectedUpsell) => {
    if (firstOffer === null && firstSelectedUpsell === null) {
        return null;
    }

    return firstSelectedUpsell === null ? firstOffer : firstSelectedUpsell; // favour selected upsell over offer if both present
});

export const getIsBetterOffer = createSelector(getOfferOrUpsell, getLeadOfferType, (pkg, leadOfferType) => {
    if (pkg === null) {
        return false;
    }
    return isBetterOffer(pkg, leadOfferType);
});

export const getOfferOrUpsellIsMCP = createSelector(getOfferOrUpsell, (pkg) => {
    if (pkg === null) {
        return false;
    }

    return isOfferMCP(pkg.type);
});

export const getOfferOrUpsellDeal = createSelector(getOfferOrUpsell, (pkg) => {
    return pkg?.deal || null;
});

export const getOfferOrUpsellPackage = createSelector(getOfferOrUpsell, (offerOrUpsell) => {
    if (offerOrUpsell === null) {
        return null;
    }
    return new OfferPackage(offerOrUpsell);
});

export const getOfferOrUpsellPackagePlatform = createSelector(getOfferOrUpsellPackage, (pkg) => {
    return pkg?.platform || '';
});

export const getOfferOrUpsellPackageIsFree = createSelector(getOfferOrUpsellPackage, (pkg) => {
    return !!pkg && !!pkg.type && (pkg.type === PlanTypeEnum.TrialExtension || pkg.type === PlanTypeEnum.TrialExtensionRTC);
});

export const getOfferOrUpsellPackageIsAdvantage = createSelector(getOfferOrUpsellPackage, (pkg) => {
    return !!pkg && ((!!pkg.advantage && pkg.advantage) || (!!pkg.type && pkg.type === PlanTypeEnum.Advantage));
});

export const getOfferOrUpsellPrice = createSelector(getOfferOrUpsell, getOfferOrUpsellPackageIsFree, (offerOrUpsell, isFreeOffer) => {
    return {
        offerOrUpsellExists: getOfferOrUpsellPrice !== null,
        isFreeOffer,
        offerPrice: offerOrUpsell !== null ? offerOrUpsell.price : null,
        processingFee: offerOrUpsell !== null ? offerOrUpsell.processingFee : null,
    };
});

export const getUpgradePackage = createSelector(getSelectedOffer, getUpgrades, (selectedOffer, upgradeInfo) => {
    if (selectedOffer && upgradeInfo && upgradeInfo.upgradeOffers && upgradeInfo.upgradeOffers.upgrade && upgradeInfo.upgradeOffers.upgrade.length > 0) {
        return upgradeInfo.upgradeOffers.upgrade[0];
    }

    return null;
});

export const getOfferOrUpsellPricingInfo = createSelector(
    getOfferOrUpsell,
    getUpgradePackage,
    getOfferOrUpsellPackageIsFree,
    getOfferOrUpsellIsMCP,
    (offerOrUpsell, upgradePkg, isFreeOffer, isMCP) => {
        if (offerOrUpsell === null) {
            return null;
        }
        const isPartnerIneligible = offerOrUpsell.fallback === true && offerOrUpsell.fallbackReason === 'PARTNER_INELIGIBLE';

        const originalPrice = upgradePkg === null ? offerOrUpsell.msrpPrice : upgradePkg.retailPrice; // TODO: this used to be "msrpPrice" but that doesn't exist in the typing

        return {
            originalPrice,
            newPrice: offerOrUpsell.price,
            originalTerm: offerOrUpsell.termLength,
            newTerm: offerOrUpsell.termLength,
            isFreeOffer,
            isMCP,
            isPartnerIneligible,
        };
    }
);

export const getOfferOrUpsellUpgradePromo = createSelector(getOfferOrUpsell, (offer) => {
    return offer?.packageUpgrade;
});

export const getOfferOrUpsellIsUpgradePromo = createSelector(getOfferOrUpsellUpgradePromo, (packageUpgrade) => {
    return !!packageUpgrade;
});

export const getOfferNotAvailable = createSelector(getCheckoutState, (state) => state.offerNotAvailableInfo);

export const getShowOfferNotAvailable = createSelector(
    getOfferNotAvailable,
    (offerNotAvailableInfo) => offerNotAvailableInfo && offerNotAvailableInfo.offerNotAvailable && !offerNotAvailableInfo.offerNotAvailableAccepted
);

export const getOfferOrUpsellDetails = createSelector(
    getOfferOrUpsellPackageIsFree,
    getOfferOrUpsellPackagePlatform,
    getOfferOrUpsellDeal,
    getOfferNotAvailable,
    getShowOfferNotAvailable,
    getSelectedRenewalOfferRetailPrice,
    getOfferOrUpsellIsMCP,
    (isFreeOffer, platform, promoDeal, offerNotAvailableInfo, showOfferNotAvailable, selectedRewalOfferRetailPrice, selectedOfferIsMCP) => ({
        isFreeOffer,
        platform,
        promoDeal,
        offerNotAvailableInfo,
        showOfferNotAvailable,
        selectedRewalOfferRetailPrice,
        selectedOfferIsMCP,
    })
);

export const getPackageUpgradeInfo = createSelector(getOfferOrUpsell, (offer) =>
    offer?.packageUpgrade
        ? {
              packageName: offer?.packageName,
              packageUpgrade: offer?.packageUpgrade,
              termLength: offer?.termLength,
          }
        : null
);

export const getDealOfferData = createSelector(getOfferOrUpsell, (offer) =>
    offer?.deal
        ? {
              price: offer?.price,
              termLength: offer?.termLength,
          }
        : null
);

export const getIsPickAPlan = createSelector(
    getPickAPlanSelectedOfferPackageName,
    getNormalizedQueryParams,
    (packageName, queryParams) => !!packageName || queryParams.programcode?.includes('PYP')
);

export const checkoutComponentVM = createSelector(
    getCheckoutAccount,
    getOfferOrUpsell,
    getOfferOrUpsellDetails,
    getPackageUpgradeInfo,
    getDealOfferData,
    (account, offer, offerOrUpsellDetails, packageUpgradeInfo, dealOfferData) => ({
        account,
        offer,
        offerIsSelfPay: !offerTypeIsSelfPay(offer?.type),
        ...offerOrUpsellDetails,
        packageUpgradeInfo,
        dealOfferData,
    })
);

export const getFollowOnOfferPrice = createSelector(selectFirstFollowOnOffer, (followOnOffer) => followOnOffer?.price || null);

export const getLandingPageInboundUrlParams = createSelector(
    getNormalizedQueryParams,
    ({ programcode: programCode, radioid: radioId, act: accountNumber, tkn, lname, promocode }) => ({
        programCode,
        radioId,
        accountNumber,
        tkn,
        lname,
        promocode,
    })
);

export const getOffersAsArray = createSelector(getAllOffers, (offers) => (!!offers && Array.isArray(offers) ? offers : []));

export const getContainsChoicePackages = createSelector(
    getOffersAsArray,
    (offers) => !!offers?.map((offer) => offer?.parentPackageName).find((pkgName) => pkgName?.includes('CHOICE'))
);

export const getIs3For2Pyp = createSelector(getNormalizedQueryParams, (queryParams) => queryParams.programcode?.includes('3FOR2PYP'));

export const getCanUseDetailedGrid = createSelector(getCheckoutState, (state) => state?.canUseDetailedGrid);

export const getOffersAsArrayModified = createSelector(getOffersAsArray, getContainsChoicePackages, getIs3For2Pyp, (offersArray, containsChoice, is3For2Pyp) => {
    const packagesToDisplay = 3;

    if (containsChoice) {
        if (is3For2Pyp) {
            return offersArray
                .filter((offer) => !offer.packageName?.includes('SIR_AUD_ALLACCESS') && !offer.packageName?.includes('SIR_CAN_ALLACCESS'))
                .slice(-packagesToDisplay);
        }
        return offersArray.filter((offer) => !offer.packageName?.includes('SIR_AUD_PKG_MM') && !offer.packageName?.includes('SIR_CAN_MM')).slice(-packagesToDisplay);
    }
    return offersArray;
});

export const getOffersPackageNamesModified = createSelector(getOffersAsArrayModified, (renewalOffers) => renewalOffers.map((p) => p.parentPackageName || p.packageName));

export const getPlanSelectionData = createSelector(getPickAPlanSelectedOfferPackageName, getOffersAsArrayModified, (selectedOfferPackageName, packages) => ({
    packages: packages,
    selectedPackageName: selectedOfferPackageName,
}));

// TODO: Temporary selector to update prices according to increase price reqs for Canada. Should be removed once the updated prices comes from MS services.
export const getTemporalIncreasedPriceOfferArray = createSelector(getIsCanadaMode, getProvinceIsQuebec, getOffersAsArrayModified, (isCanada, isQuebec, offers) => {
    return isCanada
        ? offers.map((offer) => {
              if (isQuebec) {
                  return {
                      ...offer,
                      msrpPrice:
                          offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_CHOICE')
                              ? 9.59
                              : offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_EVT')
                              ? 21.6
                              : offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_ALLACCESS')
                              ? 27.6
                              : offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_MM')
                              ? 15.6
                              : offer.msrpPrice,
                  };
              } else if (!isQuebec) {
                  return {
                      ...offer,
                      msrpPrice:
                          offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_EVT')
                              ? 17.99
                              : offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_ALLACCESS')
                              ? 22.99
                              : offer?.type === 'TRIAL_EXT' && offer?.packageName?.includes('SIR_CAN_MM')
                              ? 12.99
                              : offer.msrpPrice,
                  };
              }
          })
        : offers;
});
// -------------------------------------------------------------------------------------------------------------------

export const getOffersPrices = createSelector(getTemporalIncreasedPriceOfferArray, (offers) => {
    if (!!offers && Array.isArray(offers) && offers?.length > 0) {
        return offers.map((offer) => ({
            pricePerMonth: offer?.type === 'TRIAL_EXT' ? offer?.msrpPrice : offer?.pricePerMonth,
            mrdEligible: offer?.mrdEligible,
            msrpPrice: offer?.msrpPrice,
            termLength: offer?.termLength,
            retailPrice: offer?.retailPrice,
            type: offer?.type,
            price: offer?.price,
        }));
    }
    return null;
});

export const getShowChoiceNotAvailableError = createSelector(getOffersAsArray, (offers) => {
    const fallback = offers.filter((offer) => offer.fallbackReason === OfferNotAvailableReasonEnum.RADIO_INELIGIBLE_FOR_CHOICE_PLAN);
    if (fallback && fallback[0] && fallback[0].fallback) {
        return true;
    }
    return false;
});

export const getPlanComparisonGridParams = createSelector(
    selectOffer,
    getOffersAsArrayModified,
    getIs3For2Pyp,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getCanUseDetailedGrid,
    (leadOffer, allOffers, is3For2PyP, allPackageDescriptions, canUseDetailedGrid) => ({
        pickAPlanFormData: {
            selectedPackageName: leadOffer?.packageName,
            familyDiscount: null,
            leadOfferPackageName: leadOffer?.packageName,
            leadOfferTerm: leadOffer?.termLength,
            trialEndDate: null,
        },
        usePlanComparisonGridDetailed: is3For2PyP && canUseDetailedGrid,
        planComparisonGridDetailedData: {
            plan1: {
                packageName: allPackageDescriptions[allOffers[0].parentPackageName]?.name,
                planCode: allOffers[0].planCode,
                channelCount: allPackageDescriptions[allOffers[0].parentPackageName]?.channels[0]?.count,
                promoTermLength: allOffers[0].termLength,
                promoPricePerMonth: allOffers[0].price,
                pricePerMonth: allOffers[0].retailPrice,
                listenOn: {
                    insideTheCar: true,
                    outsideTheCar: true,
                },
                channelLineupUrl: allPackageDescriptions[allOffers[0].parentPackageName]?.channelLineUpURL,
            },
            plan2: {
                packageName: allPackageDescriptions[allOffers[1].packageName]?.name,
                planCode: allOffers[1].planCode,
                channelCount: allPackageDescriptions[allOffers[1].packageName]?.channels[0]?.count,
                promoTermLength: allOffers[1].termLength,
                promoPricePerMonth: allOffers[1].price,
                pricePerMonth: allOffers[1].retailPrice,
                listenOn: {
                    insideTheCar: true,
                    outsideTheCar: true,
                },
                channelLineupUrl: allPackageDescriptions[allOffers[1].packageName]?.channelLineUpURL,
            },
            plan3: {
                packageName: allPackageDescriptions[allOffers[2].packageName]?.name,
                planCode: allOffers[2].planCode,
                channelCount: allPackageDescriptions[allOffers[2].packageName]?.channels[0]?.count,
                promoTermLength: allOffers[2].termLength,
                promoPricePerMonth: allOffers[2].price,
                pricePerMonth: allOffers[2].retailPrice,
                listenOn: {
                    insideTheCar: true,
                    outsideTheCar: true,
                },
                channelLineupUrl: allPackageDescriptions[allOffers[2].packageName]?.channelLineUpURL,
            },
            bestValuePlanCode: determineBestValuePlan(allOffers),
            features: mapFeaturesSummaryToFeatures(allOffers, allPackageDescriptions),
        },
    })
);

function mapFeaturesSummaryToFeatures(allOffers, allPackageDescriptions) {
    const features = [];

    allOffers?.forEach((offer, index) => {
        const allFeatureSummary = allPackageDescriptions[offer.packageName]?.channels[0]?.featureSummary;
        allFeatureSummary?.forEach((featureSummaryObject) => {
            const initialFeatureObj = features.find((featureSummary) => featureSummary.name === featureSummaryObject.name);
            if (!initialFeatureObj) {
                features.push({ name: featureSummaryObject.name, capabilityPlan1: null, capabilityPlan2: null, capabilityPlan3: null });
            }

            const featureObj = features.find((featureSummary) => featureSummary.name === featureSummaryObject.name);
            if (featureObj) {
                featureObj[`capabilityPlan${index + 1}`] = featureSummaryObject.capability;
            }
        });
    });

    return features;
}

function determineBestValuePlan(allOffers) {
    const choicePlan = allOffers.filter((offer) => offer?.packageName?.includes('CHOICE'));
    return choicePlan[0]?.planCode;
}

export const getChoiceGenrePackageNameOptions = createSelector(getIsRtc, getOffersAsArray, getRenewalPackageOptions, (isRtc, offers, renewalOffers) =>
    isRtc
        ? renewalOffers.filter((offer) => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1).map((offer) => offer.packageName)
        : offers.filter((offer) => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1).map((offer) => offer.packageName)
);

const getIsProactiveRTCFlow = createSelector(getCheckoutState, (state) => state.isProactiveRTC);

export const getAddGenreStep = createSelector(
    getIsProactiveRTCFlow,
    getSelectedRenewalPackageName,
    getPickAPlanSelectedOfferPackageName,
    (isProactive, packageName, pickAPlanSelectedOfferPackageName) =>
        (!!packageName && packageName?.indexOf('CHOICE') !== -1 && isProactive) ||
        (!!pickAPlanSelectedOfferPackageName && pickAPlanSelectedOfferPackageName?.indexOf('CHOICE') !== -1)
);

export const getSelectOffer = createSelector(selectOffer, (offer) => offer);

export const getPickAPlanOfferDetails = createSelector(
    selectOffer,
    getNormalizedQueryParams,
    getOffersAsArrayModified,
    getIsPickAPlan,
    (offer, { programcode: programCode }, packages, isPickAPlan) =>
        isPickAPlan && {
            leadOffer: offer,
            programCode,
            packages,
            offerDetails: offerToOfferDetails(offer),
        }
);

export const getSelectedOfferDetails = createSelector(selectOffer, (offer) => {
    return (
        offer &&
        ({
            type: offer.deal ? offer.deal.type : offer.type,
            offerTotal: offer.price,
            processingFee: offer.processingFee,
            msrpPrice: offer.msrpPrice,
            name: offer.packageName,
            offerTerm: offer.termLength,
            offerMonthlyRate: offer.pricePerMonth,
            savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
            retailRate: offer.retailPrice,
            etf: offer.deal && offer.deal.etfAmount,
            etfTerm: offer.deal && offer.deal.etfTerm,
            priceChangeMessagingType: offer.priceChangeMessagingType,
            deal: offer.deal,
            isMCP: offer.type === 'PROMO_MCP',
            isLongTerm: offer.type === 'LONG_TERM',
            offerType: offer.type,
        } as unknown as OfferDetails)
    );
});

export const getCurrentPackageName = createSelector(getFirstSubscriptionInCheckoutAccount, (subscription) => subscription?.plans[0].packageName);

export const getEligibilityCheckRequestData = createSelector(
    getSelectedOfferOrOffer,
    getFlep,
    getServiceAddress,
    getPaymentInfo,
    (selectedOffer, flepData, address, paymentInfo) => ({
        planCode: selectedOffer?.offers?.[0].planCode,
        firstName: flepData?.firstName,
        lastName: flepData?.lastName,
        email: flepData?.email,
        ...(address?.zip && { zipCode: address?.zip }),
        ...(paymentInfo?.cardNumber && { creditCardNumber: paymentInfo?.cardNumber }),
    })
);

// NOTE: These are needed in here to solve issue DEX-36399
//       We don't have these selectors in the purchase-state. They do exist in purchase-triage.selectors.ts,
//       however we can't import from there in this file because that file imports this file (circular dep).
//       So we need to recreate those here to patch fix this. :(
//       These are used by the getOffersLoadedAndUpsellRequestData below to support getting the account
//       data from purchase-state which is where it ends up in the student streaming experience.
const getPurchaseState = createFeatureSelector<PurchaseState>(PurchaseStateConstant.STORE.NAME);
const getPurchaseDataAccount = createSelector(getPurchaseState, (state) => state?.data?.account);

export const getOffersLoadedAndUpsellRequestData = createSelector(
    getAllOffersAsArray,
    // TODO: add selector to get eligibilityRan flag from offers endpoint call result
    getProgramCode,
    getFirstSubscriptionIdInCheckoutAccount,
    getServiceAddress,
    getCheckoutAccount,
    getPurchaseDataAccount,
    (offers, programCode, subscriptionId, address, account, purchaseAccount) => ({
        offers: offers.map((offer) => ({ ...offer, code: offer.planCode })),
        programCode,
        subscriptionId,
        province: address?.state,
        eligibilityRan: true,
        // Since we have checkout-state and purchase-state and sometimes the account data is in one or the other,
        //  we need to try to use the checkout account first and if we don't have it fall back to purchase account :(
        //  This is to help solve issue DEX-36399
        account: account ? account : purchaseAccount,
    })
);

export const getFirstOfferIsEligible = createSelector(getFirstOfferIsFallbackForNotStreamingEligible, (isEligibilityFallback) => !isEligibilityFallback);
export const getNotEligibleForStreamingPlan = createSelector(
    getIsStreaming,
    getFirstOfferIsEligible,
    getNormalizedQueryParams,
    (isStreaming, eligible, { ineligibleforoffer: ineligibleForOffer }) => ineligibleForOffer || (isStreaming && !eligible)
);
export const getSelectedOfferPlancode = createSelector(getSelectedOfferOrOffer, (selectedOffer) => selectedOffer?.offers?.[0].planCode || null);
export const getLeadOfferPlanCodes = createSelector(getOffersFromOfferState, (offers) => offers?.map((offer) => offer.planCode));

export const getOtherPlansQueryParamsAndPath = createSelector(getNormalizedQueryParams, (queryParams) => {
    !!queryParams?.pyp && delete queryParams.pyp;
    // TODO: The value of programcode is hardcoded at this point. This is a temporary solution.
    queryParams = { ...queryParams, programcode: '3FOR1PYP' };
    return {
        queryParams,
        path: !!queryParams?.act && !!queryParams?.radioid ? '/subscribe/checkout/offer' : '/subscribe/checkout/offer/flepz',
    };
});

export { getIsStudentOffer } from '@de-care/domains/offers/state-offers';
