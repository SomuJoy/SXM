import { getLanguage } from '@de-care/domains/customer/state-locale';
import { createSelector } from '@ngrx/store';
import { getFirstOffer, getSecondOffer, isOfferMCP } from '../../data-services/helpers';
import { selectFeature } from './feature.selectors';
import {
    getIsNOUVChoiceOrMM,
    getRenewalsIncludesChoice,
    getRenewalsSingleType,
    getSelectedRenewalPackageName,
    getSelectedRenewalPrice,
    getSelectedRenewalTermLength,
    getRenewalOffersFirstOfferPrice,
} from './renewal-offers.selectors';
import { getIsCanadaMode } from '@de-care/settings';

export interface OfferDetails {
    type: string;
    offerTotal: number;
    processingFee: number;
    msrpPrice: number;
    name: string;
    offerTerm: number;
    offerMonthlyRate: number;
    savingsPercent: number;
    retailRate: number;
    etf: number;
    etfTerm: string;
    priceChangeMessagingType: string;
    deal: string;
    isMCP: string;
    isLongTerm: string;
    offerType: string;
    renewalName?: string;
    renewalPrice?: number;
    renewalTermLength?: number;
}

export const selectOffer = createSelector(selectFeature, (state) => getFirstOffer(state.offers));
export const selectSecondOffer = createSelector(selectFeature, (state) => getSecondOffer(state.offers));
export const getAllOffers = createSelector(selectFeature, (state) => state.offers);
export const getAllOffersAsArray = createSelector(selectFeature, (state) => (state && Array.isArray(state.offers) ? state.offers : []));
export const getContainsChoicePackages = createSelector(
    getAllOffersAsArray,
    (offers) => !!offers?.map((offer) => offer?.parentPackageName).find((pkgName) => pkgName?.includes('CHOICE'))
);

export const getOffersAsArrayModified = createSelector(getAllOffersAsArray, getContainsChoicePackages, (offersArray, containsChoice) => {
    const packagesToDisplay = 3;

    if (containsChoice) {
        return offersArray.filter((offer) => !offer.packageName?.includes('SIR_AUD_PKG_MM') && !offer.packageName?.includes('SIR_CAN_MM')).slice(-packagesToDisplay);
    }
    return offersArray;
});
export const getOffersPackageNamesModified = createSelector(getOffersAsArrayModified, (renewalOffers) => renewalOffers.map((p) => p.parentPackageName || p.packageName));
export const getAllNonDataCapableOffers = createSelector(getAllOffers, (offers) => offers && offers.filter((offer) => !offer.dataCapable));
export const getAllDataCapableOffers = createSelector(getAllOffers, (offers) => offers && offers.filter((offer) => offer.dataCapable));
// TODO: Rename it to getAllNonDataCapableOffersAsArray
export const getAllNonDataCapableOffersAsArray = createSelector(getAllNonDataCapableOffers, (offers) => (!!offers && Array.isArray(offers) ? offers : []));
export const getAllDataCapableOffersAsArray = createSelector(getAllDataCapableOffers, (offers) => (!!offers && Array.isArray(offers) ? offers : []));
export const getAllDataCapableOffersUniqueByTerm = createSelector(getAllDataCapableOffersAsArray, (offers) =>
    offers.filter((offer) => offer.termLength === 1 || offer.type === 'PROMO')
);

export const getOffersDataForAllOffers = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers.length > 0
        ? offers.reduce(
              (offersData, offer) => ((offersData[offer.planCode] = { isMCP: isOfferMCP(offer.type), termLength: offer.termLength, type: offer.type }), offersData),
              {}
          )
        : null
);
export const getLeadOffersIds = createSelector(selectFeature, (state) => state.leadOffersIds);
export const getCompatibleOffersIds = createSelector(selectFeature, (state) => state.compatibleOffersIds);
export const getLeadOffers = createSelector(getAllNonDataCapableOffersAsArray, getLeadOffersIds, (offers, leadOffersIds) =>
    leadOffersIds.map((planCode) => offers.find((offer) => offer.planCode === planCode))
);
export const getCompatibleOffers = createSelector(getAllNonDataCapableOffersAsArray, getCompatibleOffersIds, (offers, compatibleOffersIds) =>
    compatibleOffersIds.map((planCode) => offers.find((offer) => offer.planCode === planCode))
);

export const getFirstOfferIsStreaming = createSelector(selectOffer, (offer) => offer?.streaming || false);
export const getFirstOfferTermLength = createSelector(selectOffer, (offer) => offer?.termLength);
export const getFirstOfferPlanCode = createSelector(selectOffer, (offer) => offer?.planCode);
export const getSecondOfferPlanCode = createSelector(selectSecondOffer, (offer) => offer?.planCode);
export const getConfiguredLeadOfferOrFirstOffer = createSelector(getAllOffersAsArray, (offers) => {
    const leadOffer = offers.find((offer) => offer.leadOffer);
    return leadOffer || offers[0];
});
// TODO: change this to use the above selector
export const getConfiguredLeadOfferOrFirstOfferPlanCode = createSelector(getAllOffersAsArray, (offers) => {
    const leadOffer = offers.find((offer) => offer.leadOffer);
    return leadOffer?.planCode || offers?.[0]?.planCode;
});
export const getAllOfferPlanCodes = createSelector(getAllOffersAsArray, (offers) => offers.map((offer) => offer.planCode));
export const getAllOfferPackageNameKeysMappedByPlanCode = createSelector(getAllOffersAsArray, (offers) =>
    offers.reduce((set, offer) => {
        set[offer.planCode] = offer.packageName;
        return set;
    }, {})
);
export const getFirstOfferType = createSelector(selectOffer, (offer) => offer?.type);
export const getFirstOfferIsFallbackForNotStreamingEligible = createSelector(
    selectOffer,
    (offer) => offer?.fallback && offer?.fallbackReason.toLowerCase() === 'streaming_ineligible'
);

export const getFirstOfferIsFallback = createSelector(selectOffer, (offer) => offer?.fallback);
export const getSavingsPercentagesForAllOffers = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers.length > 0
        ? offers.reduce((obj, offer) => {
              obj[offer.planCode] = Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100);
              return obj;
          }, {})
        : null
);

export const getTermForAllOffers = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers.length > 0
        ? offers.reduce((obj, offer) => {
              obj[offer.planCode] = offer.price === offer.pricePerMonth ? 'monthly' : 'full';
              return obj;
          }, {})
        : null
);
export const getOfferDetails = createSelector(selectOffer, getIsCanadaMode, getRenewalOffersFirstOfferPrice, (offer, isCanada, renewalPrice) => {
    return (
        offer &&
        ({
            type: offer.deal ? offer.deal.type : offer.type,
            offerTotal: offer.price,
            processingFee: offer.processingFee,
            msrpPrice: isCanada && offer.type === 'RTP_OFFER' && renewalPrice ? renewalPrice : offer.msrpPrice,
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

export const getOfferAndRenewalDetails = createSelector(
    getOfferDetails,
    getSelectedRenewalPackageName,
    getSelectedRenewalPrice,
    getSelectedRenewalTermLength,
    getIsNOUVChoiceOrMM,
    getRenewalsSingleType,
    getRenewalsIncludesChoice,
    getLanguage,
    (offerDetails, renewalPackageName, renewalPrice, renewalTermLength, isChoiceOrMM, renewals, renewalsIncludeChoice, language) => {
        return {
            offerDetails: {
                ...offerDetails,
                renewalName: renewalPackageName,
                renewalPrice,
                renewalTermLength,
            },
            language,
            isChoiceOrMM,
            renewals,
            renewalsIncludeChoice,
        };
    }
);

export const getOfferData = createSelector(selectOffer, getOfferDetails, (offer, offerDetails) => ({ offer: offer, offerDetails: offerDetails }));
export const getOfferPlanCode = createSelector(selectOffer, (offer) => offer?.planCode || null);

export const getPlanCodeFromSelectedOffer = createSelector(selectOffer, (offer) => offer?.planCode || null);

export const getAllOffersSummaryData = createSelector(getAllNonDataCapableOffersAsArray, (offers) =>
    offers.map(({ planCode, price, packageName }) => ({ planCode, price, packageName }))
);
export const getAllDataCapableOffersSummaryData = createSelector(getAllDataCapableOffersAsArray, (offers) =>
    offers.map(({ planCode, price, packageName }) => ({ planCode, price, packageName }))
);

export const getOfferType = createSelector(selectOffer, (offer) => offer?.type);
export const getIsOfferMCP = createSelector(selectOffer, (offer) => isOfferMCP(offer.type));

export const getAllOffersUniqueByTerm = createSelector(
    getAllOffersAsArray,
    (offers) =>
        offers.filter(
            (offer) =>
                offer.termLength === 1 ||
                offer.type === 'PROMO' ||
                offer.type === 'PROMO_MCP' ||
                offer.type === 'TRIAL_EXT' ||
                offer.planCode === 'Promo - All Access - 3mo - $0.00' ||
                offer.planCode === 'Promo - All Access - 3mo - 0.00'
        ) // TODO: Replace Hardcoded name with type
);

export const getIsStudentOffer = createSelector(selectOffer, (offer) => offer?.student || false);

export const getPresentmentTestCell = createSelector(selectFeature, (state) => state.presentmentTestCell);
