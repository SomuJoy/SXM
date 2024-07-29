import {
    getCustomerInfo,
    getPaymentInfo,
    getSelectedOffer,
    getSelectedPlanCode,
    getSelectedProvinceCode,
    getTransactionIdForSession,
    getUserEnteredCredentials,
    selectInboundQueryParams,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getFirstAccountSubscriptionId, selectAccount } from '@de-care/domains/account/state-account';
import { getRenewalOffersFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getCurrentQuote } from '@de-care/domains/quotes/state-quote';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutStreamingRollToDropState, featureKey } from './reducer';

export const featureState = createFeatureSelector<CheckoutStreamingRollToDropState>(featureKey);

const getProgramCodeFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.programcode);
const getPromoCodeFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.promocode);
export const getShoulPresentRenewalFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => !(queryParams?.skiprenewal === 'true'));

export const getOrganicPurchaseDataHasBeenLoaded = createSelector(getSelectedOffer, (selectedOffer) => !!selectedOffer);

export const getSelectedOfferIsRtdTrial = createSelector(
    getSelectedOffer,
    (selectedOffer) => selectedOffer?.marketType === 'trial:streaming' && selectedOffer?.type === 'RTD_OFFER'
);

export const getFallbackReasonStatus = createSelector(getSelectedOffer, (selectedOffer) => selectedOffer?.fallbackReason === 'EXPIRED');

export const getUsePrefillRequested = createSelector(selectInboundQueryParams, (queryParams) => !!queryParams?.datafromrflz && queryParams.datafromrflz === 'e');
export const getOrganicValidatePromoCodePayload = createSelector(getPromoCodeFromQueryParams, (marketingPromoCode) =>
    marketingPromoCode ? { marketingPromoCode, streaming: true } : null
);

export const getIsFullAddressForm = createSelector(featureState, (state) => state?.isFullAddressForm);

export const getOrganicOfferLoadPayload = createSelector(
    getProgramCodeFromQueryParams,
    getPromoCodeFromQueryParams,
    getSelectedProvinceCode,
    (programCode, marketingPromoCode, province) => ({
        programCode,
        marketingPromoCode,
        streaming: true,
        student: false,
        province,
    })
);

export const getPromoCode = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.promocode);

export const getProgramCode = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.programcode);

const getUserEnteredCredentialsEmail = createSelector(getUserEnteredCredentials, (credentials) => credentials?.email);

export const getPayloadForOffersLoad = createSelector(
    getPromoCode,
    getProgramCode,
    getUserEnteredCredentialsEmail,
    selectAccount,
    (marketingPromoCode, programCode, userEnteredEmail, account) => ({
        request: {
            ...(marketingPromoCode ? { marketingPromoCode } : {}),
            ...(programCode ? { programCode } : {}),
            streaming: true,
            student: false,
        },
        useCustomerOfferCall: !!userEnteredEmail || !!account,
    })
);
export const getEligibilityCheckRequestData = createSelector(
    getSelectedPlanCode,
    getCustomerInfo,
    getUserEnteredCredentials,
    getPaymentInfo,
    (planCode, customerInfo, credentials, paymentInfo) => ({
        planCode,
        firstName: customerInfo?.firstName,
        lastName: customerInfo?.lastName,
        email: credentials?.email,
        zipCode: paymentInfo?.serviceAddress?.zip,
        creditCardNumber: paymentInfo?.cardNumber,
    })
);

export const getQuoteRequestDataForFollowon = createSelector(
    getRenewalOffersFirstOfferPlanCode,
    getSelectedPlanCode,
    getFirstAccountSubscriptionId,
    (renewalPlanCode, trialPlancode, subscriptionId) => ({
        renewalPlanCode,
        planCodes: [trialPlancode],
        subscriptionId,
    })
);

export const getSelectedOfferOfferInfoDetails = createSelector(getSelectedPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return offersInfo[planCode];
});

export const getSelectedOfferIsFallback = createSelector(getSelectedOffer, (offer) => offer?.fallback);

export const getIsQuebecProvince = createSelector(getSelectedProvinceCode, (selectedProvinceCode) => selectedProvinceCode?.toLowerCase() === 'qc');
export const getCountryCode = createSelector(featureState, (state) => state?.countryCode);

export const getPayloadForNewAccountOrganicPurchaseTransaction = createSelector(
    getSelectedPlanCode,
    getUserEnteredCredentials,
    getSelectedProvinceCode,
    (planCode, credentials, state) => {
        return {
            plans: [{ planCode }],
            streamingInfo: {
                emailAddress: credentials.email,
                login: credentials.userName || credentials.email,
                password: credentials.password,
            },
            serviceAddress: {
                addressType: 'person',
                email: credentials.email,
                state,
            },
        };
    }
);

const getOfferCodes = createSelector(getPromoCode, getRenewalOffersFirstOfferPlanCode, (marketingPromoCode, followonPlanCode) => ({
    marketingPromoCode,
    followonPlanCode,
}));

export const getPayloadForOrganicFollowonPurchaseTransaction = createSelector(
    getOfferCodes,
    getPaymentInfo,
    getCurrentQuote,
    getTransactionIdForSession,
    getFirstAccountSubscriptionId,
    ({ marketingPromoCode, followonPlanCode }, paymentInfo, currentQuote, transactionIdForSession, subscriptionId) => {
        const { serviceAddress, ...creditCardInfo } = paymentInfo;
        const [expiryMonth, expiryYear] = creditCardInfo.cardExpirationDate.split('/');
        return {
            ...(marketingPromoCode ? { marketingPromoCode } : {}),
            followOnPlans: [{ planCode: followonPlanCode }],
            paymentInfo: {
                useCardOnfile: false,
                paymentType: 'creditCard',
                cardInfo: {
                    nameOnCard: creditCardInfo.nameOnCard,
                    cardNumber: +creditCardInfo.cardNumber,
                    expiryMonth: +expiryMonth,
                    expiryYear: +expiryYear,
                    securityCode: creditCardInfo.cvv,
                },
                transactionId: transactionIdForSession,
                giftCards: [paymentInfo.giftCard],
                paymentAmount:
                    currentQuote && (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') && Math.sign(currentQuote.currentBalance + 0) === 1
                        ? currentQuote.currentBalance
                        : null,
            },
            subscriptionId: +subscriptionId,
        };
    }
);
