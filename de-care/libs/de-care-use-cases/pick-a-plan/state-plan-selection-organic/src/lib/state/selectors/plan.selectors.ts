import { createSelector } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getAllOffers, Offer, OfferDetails, offerToOfferDetails, selectOffer } from '@de-care/domains/offers/state-offers';
import { getCanUseDetailedGrid, getPickAPlanSelectedOfferPackageName, getPickAPlanSelectedOfferPlanCode } from './state.selectors';
import { OfferNotAvailableReasonEnum } from '@de-care/data-services';
import { getProvinceIsQuebec } from '@de-care/domains/customer/state-locale';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';

export const getOffersAsArray = createSelector(getAllOffers, (offers) => (!!offers && Array.isArray(offers) ? offers : []));

export const getContainsChoicePackages = createSelector(
    getOffersAsArray,
    (offers) => !!offers?.map((offer) => offer?.parentPackageName).find((pkgName) => pkgName?.includes('CHOICE'))
);

export const getIs3For2Pyp = createSelector(getNormalizedQueryParams, (queryParams) => queryParams.programcode.includes('3FOR2PYP'));

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
    packages,
    selectedPackageName: selectedOfferPackageName,
}));

function mapNewOffer(offer: Offer, isQuebec: boolean): Offer {
    if (offer.packageName.includes('SIR_CAN_ALLACCESS')) {
        const price = isQuebec ? 27.6 : 22.99;
        return {
            ...offer,
            pricePerMonth: price,
            msrpPrice: price,
            mrdEligible: offer.mrdEligible,
        };
    }

    if (offer.packageName.includes('SIR_CAN_EVT')) {
        const price = isQuebec ? 21.6 : 17.99;
        return {
            ...offer,
            pricePerMonth: price,
            msrpPrice: price,
            mrdEligible: offer.mrdEligible,
        };
    }

    if (offer.packageName.includes('SIR_CAN_MM')) {
        const price = isQuebec ? 15.6 : 12.99;
        return {
            ...offer,
            pricePerMonth: price,
            msrpPrice: price,
            mrdEligible: offer.mrdEligible,
        };
    }

    if (offer.packageName.includes('SIR_CAN_CHOICE')) {
        const price = isQuebec ? 9.59 : 7.99;
        return {
            ...offer,
            pricePerMonth: price,
            msrpPrice: price,
            mrdEligible: offer.mrdEligible,
        };
    }

    return { ...offer, pricePerMonth: offer.type === 'TRIAL_EXT' ? offer.msrpPrice : offer.pricePerMonth, mrdEligible: offer.mrdEligible };
}

export const getPickAPlanOfferDetails = createSelector(selectOffer, getNormalizedQueryParams, getOffersAsArrayModified, (offer, { programcode: programCode }, packages) => ({
    leadOffer: offer,
    programCode,
    packages,
    offerDetails: offerToOfferDetails(offer),
}));

export const getShowChoiceNotAvailableError = createSelector(getOffersAsArray, (offers) => {
    const fallback = offers.filter((offer) => offer.fallbackReason === OfferNotAvailableReasonEnum.RADIO_INELIGIBLE_FOR_CHOICE_PLAN);
    if (fallback && fallback[0] && fallback[0].fallback) {
        return true;
    }
    return false;
});

export const getOffersPrices = createSelector(getOffersAsArrayModified, getProvinceIsQuebec, (offers, isQuebec) => offers.map((offer) => mapNewOffer(offer, isQuebec)));

export const getPlanComparisonGridParams = createSelector(
    selectOffer,
    getOffersAsArrayModified,
    getIs3For2Pyp,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getCanUseDetailedGrid,
    (leadOffer, allOffers, is3For2PyP, allPackageDescriptions, canUseDetailedGrid) => ({
        pickAPlanFormData: {
            selectedPackageName: leadOffer.packageName,
            familyDiscount: null,
            leadOfferPackageName: leadOffer.packageName,
            leadOfferTerm: leadOffer.termLength,
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

export const getSelectedPackageNameFromSelectedPlanCode = createSelector(
    getPickAPlanSelectedOfferPlanCode,
    getOffersAsArrayModified,
    (planCode, offersArray) => offersArray.find((offer) => offer.planCode === planCode)?.packageName
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

export const getSelectOffer = createSelector(selectOffer, (offer) => offer);

export const getOffersPackageNames = createSelector(getOffersAsArrayModified, (offers) => offers.map((p) => p.packageName));
