import { createSelector } from '@ngrx/store';
import { getLeadOffers, getSavingsPercentagesForAllOffers, getAllNonDataCapableOffersAsArray } from '@de-care/domains/offers/state-offers';
import { getSelectedOffer, getSubscriptionId } from './state.selectors';
import { getFirstAccountSubscriptionFirstPlan, getFirstAccountSubscriptionFirstPlanPackageName, getAccountSubscriptions } from '@de-care/domains/account/state-account';

interface GridOfferModel {
    planCode: string;
    pricePerMonth: number;
    type: string;
    packageName: string;
    retailPrice?: number;
    mrdEligible?: boolean;
    msrpPrice?: number;
    parentPackageName?: string;
    price?: number;
    termLength?: number;
}

export const getIsAdvantageOffer = createSelector(getLeadOffers, (offers) => offers.length > 0 && offers.some((offer) => offer.type === 'ADVANTAGE' || offer.advantage));

export const getHighestSavings = createSelector(getSavingsPercentagesForAllOffers, (savings) => {
    if (savings) {
        const savingsArr: number[] = Object.values(savings);
        return Math.max(...savingsArr);
    } else {
        return null;
    }
});

export const getSelectedOfferType = createSelector(getSelectedOffer, (offer) => offer?.type);
export const consolidateOffers = createSelector(getLeadOffers, (leadOffers) => {
    const offers: GridOfferModel[] = leadOffers?.filter(
        (offer, index, self) =>
            index === self.findIndex((t) => (t?.parentPackageName ? t?.parentPackageName === offer?.parentPackageName : t?.packageName === offer?.packageName))
    );
    return offers;
});

export const getSortedGridOffers = createSelector(consolidateOffers, getFirstAccountSubscriptionFirstPlan, (offers, currentPlan) => {
    const currentPlanAsOffer: GridOfferModel = {
        planCode: currentPlan.code,
        pricePerMonth: currentPlan.price / currentPlan.termLength,
        type: currentPlan.type,
        packageName: currentPlan.parentPackageName || currentPlan.packageName,
    };
    // sorts offers by descending price
    const sortedOffers = [...offers].sort((a, b) => (a.retailPrice > b.retailPrice ? -1 : 1));
    // add current plan into grid offers array as first item
    sortedOffers.unshift(currentPlanAsOffer);
    return offers.length > 0 ? sortedOffers : null;
});
export const getGridOffers = createSelector(consolidateOffers, getFirstAccountSubscriptionFirstPlan, (offers, currentPlan) => {
    const currentPlanAsOffer: GridOfferModel = {
        planCode: currentPlan?.code,
        pricePerMonth: currentPlan?.termLength ? currentPlan?.price / currentPlan?.termLength : null,
        type: currentPlan?.type,
        packageName: currentPlan?.packageName,
    };

    const allOfferes = [...offers];
    allOfferes.unshift(currentPlanAsOffer);
    return offers.length > 0 ? allOfferes : null;
});

export const getGridOffersWithOutCurrentPlan = createSelector(consolidateOffers, (offers) => {
    const allOfferes = [...offers];
    return offers.length > 0 ? allOfferes : null;
});

export const getSubscriptionIsEligibleForPreSelectedOffer = createSelector(
    getFirstAccountSubscriptionFirstPlanPackageName,
    (packageName) => packageName === 'SIR_IP_SA' || packageName === 'SIR_IP_SA_ESNTL' || packageName?.includes('SIR_IP_CHOICE_')
);

export const getMusicShowCaseOfferIsAvailable = createSelector(
    getAllNonDataCapableOffersAsArray,
    (offers) => offers?.filter((offer) => offer?.packageName === 'SIR_IP_SHOWCASE')?.length > 0
);

export const getMonthlyMusicShowCaseOffer = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers?.filter((offer) => offer?.packageName === 'SIR_IP_SHOWCASE' && offer?.termLength === 1)
);

export const getSubscriptionToCancelTypeInfo = createSelector(getAccountSubscriptions, getSubscriptionId, (subscriptionsList, subscriptionId) => {
    const currentSubscription = subscriptionsList?.filter((subsListItem) => subsListItem?.id === subscriptionId?.toString());
    const active = currentSubscription?.length > 0 ? currentSubscription[0]?.status === 'Active' : false;
    const streamingOnly = currentSubscription[0]?.radioService === null;
    return { active, streamingOnly };
});
export const getStreamingPlatinumOfferIsAvailable = createSelector(
    getAllNonDataCapableOffersAsArray,
    (offers) => offers?.filter((offer) => offer?.packageName === 'SIR_IP_SA')?.length > 0
);

export const getMonthlyStreamingPlatinumOffer = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers?.filter((offer) => offer?.packageName === 'SIR_IP_SA' && offer?.termLength === 12)
);
//TODO: Remove this selector once we find permanent solution for price change.
export const getCanShowPriceChangeMessage = createSelector(getSelectedOffer, (offer) => {
    const validMessageTypes = ['MSRP', 'MRD'];
    return validMessageTypes.includes(offer?.priceChangeMessagingType) && offer?.termLength === 1;
});

export const getCurrentOfferPriceChangeMessagingType = createSelector(getSelectedOffer, (offer) => offer?.priceChangeMessagingType);
