import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, QuoteState } from './reducer';
import { extractQuoteFee } from '../helpers/account-helpers';
import { FeesLabelEnum, QuoteDetailNamesEnum } from '../data-services/quote.interface';
import { getIsCanada } from '@de-care/domains/account/state-account';

const featureSelector = createFeatureSelector<QuoteState>(featureKey);

export const getQuote = createSelector(featureSelector, (state) => state?.quote || null);

export const getCurrentQuote = createSelector(getQuote, (quote) => quote?.currentQuote || null);
export const getCurrentQuoteDetailAsArray = createSelector(getCurrentQuote, (currentQuote) =>
    !!currentQuote?.details && Array.isArray(currentQuote?.details) ? currentQuote?.details : []
);
export const getCurrentQuoteFirstDetail = createSelector(getCurrentQuoteDetailAsArray, (details) => details[0] || null);
export const getCurrentQuoteReactivationDetail = createSelector(getCurrentQuoteDetailAsArray, (details) =>
    details.find((d) => d.planCode === QuoteDetailNamesEnum.Reactivation_Charges)
);
export const getCurrentQuoteDetailPlanCode = createSelector(getCurrentQuoteFirstDetail, (currentQuoteDetail) => currentQuoteDetail?.planCode || null);
export const getCurrentQuoteDetailPriceAmount = createSelector(getCurrentQuoteFirstDetail, (currentQuoteDetail) => currentQuoteDetail?.priceAmount || null);
export const getCurrentQuoteDetailTermLength = createSelector(getCurrentQuoteFirstDetail, (currentQuoteDetail) => currentQuoteDetail?.termLength || null);
export const getCurrentQuoteTax = createSelector(getCurrentQuote, (currentQuote) => currentQuote?.totalTaxAmount || null);
export const getCurrentQuoteRoyaltyFee = createSelector(getCurrentQuote, getIsCanada, (currentQuote, isCanada) =>
    extractQuoteFee(currentQuote?.fees, isCanada ? FeesLabelEnum.Canada_Music_Royalty_Fee : FeesLabelEnum.US_Music_Royalty_Fee)
);
export const getCurrentQuoteRemainingServiceBalanceFee = createSelector(getCurrentQuote, getIsCanada, (currentQuote, isCanada) =>
    extractQuoteFee(currentQuote?.fees, isCanada ? FeesLabelEnum.Canada_Remaining_Service_Balance_Fee : FeesLabelEnum.Remaining_Service_Balance_Fee)
);
export const getCurrentQuoteActivationFee = createSelector(getCurrentQuote, (currentQuote) => extractQuoteFee(currentQuote?.fees, FeesLabelEnum.Activation_Fee));
export const getCurrentQuoteReactivationFee = createSelector(getCurrentQuoteReactivationDetail, (reactivationDetail) => Number(reactivationDetail?.priceAmount));
export const getCurrentQuoteDetailPlanCodes = createSelector(getCurrentQuoteDetailAsArray, (details) => details.map((detail) => detail.planCode));
export const getCurrentQuotePriceAmountAsArray = createSelector(getCurrentQuoteDetailAsArray, (details) => details.map(({ priceAmount }) => Number(priceAmount)));
export const getCurrentQuotePriceAmountTotal = createSelector(
    getCurrentQuotePriceAmountAsArray,
    (priceAmount) => Math.round((priceAmount.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + Number.EPSILON) * 100) / 100
);

export const getRenewalQuote = createSelector(getQuote, (quote) => quote?.renewalQuote || null);
export const getRenewalQuoteDetailAsArray = createSelector(getRenewalQuote, (renewalQuote) =>
    !!renewalQuote?.details && Array.isArray(renewalQuote?.details) ? renewalQuote?.details : []
);
export const getRenewalQuoteFirstDetail = createSelector(getRenewalQuoteDetailAsArray, (details) => details[0] || null);
export const getRenewalQuoteDetailPlanCode = createSelector(getRenewalQuoteFirstDetail, (renewalQuoteDetail) => renewalQuoteDetail?.planCode || null);
export const getRenewalQuoteDetailPriceAmount = createSelector(getRenewalQuoteFirstDetail, (renewalQuoteDetail) => renewalQuoteDetail?.priceAmount || null);
export const getRenewalQuoteDetailPlanCodes = createSelector(getRenewalQuoteDetailAsArray, (details) => details.map((detail) => detail.planCode));
export const getRenewalQuotePriceAmountAsArray = createSelector(getRenewalQuoteDetailAsArray, (details) => details.map(({ priceAmount }) => Number(priceAmount)));
export const getRenewalQuotePriceAmountTotal = createSelector(
    getRenewalQuotePriceAmountAsArray,
    (priceAmount) => Math.round((priceAmount.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + Number.EPSILON) * 100) / 100
);

export const getRenewalQuoteTax = createSelector(getRenewalQuote, (renewalQuote) => renewalQuote?.totalTaxAmount || null);
export const getRenewelQuoteRoyaltyFee = createSelector(getRenewalQuote, (renewalQuote) => extractQuoteFee(renewalQuote?.fees, FeesLabelEnum.US_Music_Royalty_Fee));
export const getRenewelQuoteActivationFee = createSelector(getRenewalQuote, (renewalQuote) => extractQuoteFee(renewalQuote?.fees, FeesLabelEnum.Activation_Fee));

export const getFutureQuote = createSelector(getQuote, (quote) => quote?.futureQuote || null);
export const getFutureQuoteDetailAsArray = createSelector(getFutureQuote, (futureQuote) =>
    !!futureQuote?.details && Array.isArray(futureQuote?.details) ? futureQuote?.details : []
);
export const getFutureQuoteFirstDetail = createSelector(getFutureQuoteDetailAsArray, (details) => details[0] || null);
export const getQuoteIsMilitary = createSelector(getRenewalQuoteFirstDetail, getCurrentQuoteFirstDetail, getFutureQuoteFirstDetail, (...quoteDetails) =>
    quoteDetails.some((detail) => detail?.isMilitary)
);
export const getCurrentQuoteAmoutIsZero = createSelector(getQuote, (quote) => +quote?.currentQuote?.totalAmount === 0);
