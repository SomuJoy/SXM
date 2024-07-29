import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutStreamingState, featureKey } from './reducer';
import { selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import {
    getCustomerInfo,
    getPaymentInfo,
    getPaymentInfoServiceAddress,
    getSelectedPlanCode,
    getSelectedProvinceCode,
    getTransactionIdForSession,
    selectInboundQueryParams,
    getPlanRecapCardViewModel,
    getSelectedOfferChannelCount,
    getSelectedOfferPlatformAndPlanName,
    getSelectedOfferPriceAndTermInfo,
    getLongDescriptionPlanRecapCardViewModel,
    getSelectedOffer,
    getUserEnteredCredentials,
    getPaymentInfoBillingAddress,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getNormalizedQueryParams, selectRouteData } from '@de-care/shared/state-router-store';
import { getCurrentQuote } from '@de-care/domains/quotes/state-quote';
import {
    getAccountBillingSummary,
    getAccountFirstSubscriptionFirstPlan,
    getAccountFirstSubscriptionSubscriptionID,
    getAccountServiceAddressState,
    getDoesAccountHaveAtLeastOneTrial,
    getFirstAccountSubscriptionId,
    getMaskedUserNameFromToken,
    selectAccount,
} from '@de-care/domains/account/state-account';
import { selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';
import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';

export const featureState = createFeatureSelector<CheckoutStreamingState>(featureKey);
export const getUserEnteredCredentialsEmail = createSelector(getUserEnteredCredentials, (credentials) => credentials?.email);
export const getTransactionData = createSelector(featureState, (state) => state.transactionData);
export const getTransactionSubscriptionId = createSelector(getTransactionData, (transactionData) => transactionData?.subscriptionId);
export const getUserPickedAPlanCode = createSelector(featureState, (state) => state.userPickedAPlanCode);
export const getPromoCode = createSelector(featureState, (state) => state?.promoCode);

export const getProgramCode = createSelector(getNormalizedQueryParams, (queryParams) => queryParams?.programcode);
export const getSkipInitialLoadOffers = createSelector(selectRouteData, (data) => data?.skipInitialLoadOffers);
export const getPromoCodeFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.promocode);

// TODO: elevate this out to some shared lib for common JavaScript helpers
function getIntersectionOfSetsAsArray(arrayOneSet: Set<any>, arrayTwoSet: Set<any>): any[] {
    return [...arrayTwoSet].filter((x) => arrayOneSet.has(x));
}
// We only want to support a subset of program codes right now and only PHX query param of programcode and upcode.
//  This queryParamKeysNotAllowed and selector handle the following logic requirements:
//      * programcode must be in the validProgramCode list
//      * upcode is allowed
//      * no other PHX app specific query param keys should be in the URL
const queryParamKeysNotAllowed = new Set(['verificationid']);
export const getAllowedQueryParamsExist = createSelector(selectInboundQueryParams, (queryParams) => {
    if (!queryParams) {
        return false;
    }
    // we want to allow entering into the flow if promocode is '' (empty)
    const hasPromoCode = queryParams?.promocode !== undefined;
    const programCode = queryParams?.programcode?.toUpperCase();
    const invalidParamKeys = getIntersectionOfSetsAsArray(queryParamKeysNotAllowed, new Set(Object.keys(queryParams)));

    const validProgramCode = [
        'USTPSRTP3MOFREE',
        'USTPSRTP3MOFREEROKT',
        'USTPSRTP3MO99',
        'USTPSRTP3MO99FL',
        'USTPSRTP3MO99AFF',
        'MS1MORETAIL',
        'USTMSRTP3MOFREE',
        'USTMSRTP3MO1',
        'USTMSRTP4MOFREE',
        'USTMSRTP4MO1',
        'MS3MOFREE',
        'CAMS1MORETAIL',
        'CADISTRPLRTP3FOR1',
        'CATMSRTP3MOFREE',
        'CATMSRTP4MOFREE',
        'CATSLMSRTP3MOFREE',
        'CATMSRTP3MO1',
        'CATMSRTP4MO1',
        'USSMGRTP6MOFREE',
        'IONUSTPSRTP3MOFREE',
        'USTESSRTP3MOFREE',
        'USTPSRTP1MO99',
        'USTPSRTP2MO99',
        'USTPSRTP3MO99ROKT',
        'USTPSRTP4MO99',
        'USTPSRTP1MOFREE',
        'USTPSRTP2MOFREE',
        'USTPSRTP4MOFREE',
        'USTESSRTP1MO99',
        'USTESSRTP2MO99',
        'USTESSRTP3MO99',
        'USTESSRTP4MO99',
        'USTESSRTP1MOFREE',
        'USTESSRTP2MOFREE',
        'STREAM1MO99',
        'STREAM2MO99',
        'STREAM3MO99',
        'STREAM4MO99',
        'STREAM1MOFREE',
        'STREAM2MOFREE',
        'STREAM3MOFREE',
        'STREAM4MOFREE',
        'ESS1MO99',
        'ESS2MO99',
        'ESS3MO99',
        'ESS4MO99',
        'ESS1MOFREE',
        'ESS2MOFREE',
        'ESS3MOFREE',
        'ESS4MOFREE',
        'USPRERTPPR12MO99',
        'STREAM6MO30',
        'PSRTP4MOFREEPART',
        'PSRTP6MOFREEPART',
        'PSRTP4MOFREEPART2',
        'PSRTP4MOFREEPART3',
        'PSRTP4MOFREEPART4',
        'PSRTP4MOFREEPART5',
        'PSRTP6MOFREEPART2',
        'PSRTP6MOFREEPART3',
        'PSRTP6MOFREEPART4',
        'PSRTP6MOFREEPART5',
        'PSRTP3MOFREEPART',
        'PSRTP3MOFREEPART2',
        'PSRTP3MOFREEPART3',
        'PSRTP3MOFREEPART4',
        'PSRTP3MOFREEPART5',
        'CAPSRTP4MOFREEPART',
        'CAPSRTP4MOFREEPART2',
        'CAPSRTP4MOFREEPART3',
        'CAPSRTP4MOFREEPART4',
        'CAPSRTP4MOFREEPART5',
        'CAPSRTP4MOFREEPART6',
        'CAPSRTP4MOFREEPART7',
        'CAPSRTP4MOFREEPART8',
        'CAPSRTP6MOFREEPART',
        'CAPSRTP6MOFREEPART2',
        'CAPSRTP6MOFREEPART3',
        'CAPSRTP3MOFREEPART',
        'CAPSRTP3MOFREEPART2',
        'CAPSRTP3MOFREEPART3',
        'CAPSRTP3MOFREEPART4',
        'CAPSRTP3MOFREEPART5',
        'CAPSRTP3MOFREEPART6',
        'CAPSRTP3MOFREEPART7',
        'CAPSRTP3MOFREEPART8',
        'IONUSTESRTP3MOFREE',
        'USTRPRERTP4MOFREEPART',
        'SAMSTREAM3MO',
        'USSMGRTP4MOFREE',
        'CAESS1MORETAIL',
        'CAPRE1MORETAIL',
        'CATPSRTP3MOFREE',
        'CATPSRTP3MO99',
        'CATPSRTP4MOFREE',
        'CATPSRTP4MO99',
        'CASMGRTP4MOFREE',
        'CASMGRTP6MOFREE',
        'CASAMSTREAM3MO',
        'CASMGESS4MOFREE',
        'STREAM12FOR60',
        'SXIR30',
        'CATESSRTP4MO99',
        'CAESS3MOFREE',
        'CATESSRTP3MOFREE',
        'CATESSRTP4MOFREE',
        'STREAM4FREE',
        'CASTREAM3MOFREE',
        'CAESS1MOFREE',
        'CAESS2MOFREE',
        'CASTREAM1MOFREE',
        'CASTREAM2FREE',
        'CATESSRTP3MO99',
        'CADPESSRTP1MOFREE',
        'CADPPSRTP1MOFREE',
        'CAPRM12MO',
        'CAPPREAMAZON',
        'CAESS4MOFREE',
        'CATPRERTP4MOFREEPART',
        'CATESSRTP4MOFREEPART',
        'CATPSRTP1MOFREE',
        'CATESSRTP1MOFREE',
        'CATPSRTP2MOFREE',
        'CATESSRTP2MOFREE',
        'CATPSRTP1MO99',
        'CATESSRTP1MO99',
        'CATPSRTP2MO99',
        'CATESSRTP2MO99',
        'STREAM3FREE',
        'ESS1MORETAIL',
        'PRE1MORETAIL',
        'USDOTPSRTP1FOR1G4',
        'USDOTPSRTP3FOR1G4',
        'USDOTPSRTP3FOR5G4',
        'USDOTPRERTP12MO99G4',
        'USDOTESSRTP12MO79G4',
        'CADOTPRERTP12MO99G4',
        'CADOTESSRTP12MO79G4',
        'USDOTPSRTP1FOR1G5',
        'USDOTPSRTP3FOR1G5',
        'USDOTPSRTP3FOR5G5',
        'USDOTPSRTP1FOR5G5',
        'USDOTPRERTP12MO99G5',
        'USDOTPRERTPO2O12MO99G5',
        'USDOTESSRTP12MO79G5',
        'USDOTESSRTPO2O12MO79G5',
        'PSRTP12FOR60',
        'CAPSMCPRTP12FOR499',
        'PSMCPRTP12FOR499',
        'PSMCPRTP24FOR499',
        'CAESRTP6FOR30',
        'CASAMSUNGTV',
        'CALGTV',
        'CAPSMCPRTP6FOR5',
        'CAESMCPRTP6FOR5',
        'CAESMCPRTP12FOR5',
        'CAJBLPRRTP3MOFREE',
        'CAPSMCPRTP24FOR5',
        'CAESMCPRTP24FOR5',
        'PSRTP3MOFREEPART6',
        'PSRTP3MOFREEPART7',
        'PSRTP3MOFREEPART8',
        'PSRTP3MOFREEPART9',
        'PSRTP3MOFREEPART10',
        'PSRTP4MOFREEPART6',
        'PSRTP4MOFREEPART7',
        'PSRTP4MOFREEPART8',
        'PSRTP4MOFREEPART9',
        'PSRTP4MOFREEPART10',
        'USDOTPSRTP1FOR5G4',
        'CAESSROGERSRTP3MOFREE',
        'CAPSROGERSRTP3MOFREE',
        'CAESSROGERSRTP4MOFREE',
        'CAPSROGERSRTP4MOFREE',
        'CAESSROGERSRETAIL',
        'CAPSROGERSRETAIL',
        'PSSTEPUP1MOFREE',
        'CAPSSTEPUP1MOFREE',
        'USDOTPRERTPO2O12MO99G4',
        'USDOTESSRTPO2O12MO79G4',
        'CADOTG5PRRTP3MOFREE',
        undefined,
        '',
    ].includes(programCode);
    const noInvalidParams = invalidParamKeys.length === 0;
    return (validProgramCode || hasPromoCode) && noInvalidParams;
});

export const getAllowedQueryParamsExistForAMex = createSelector(getNormalizedQueryParams, (queryParams) => {
    if (!queryParams) {
        return false;
    }
    const invalidParamKeys = getIntersectionOfSetsAsArray(queryParamKeysNotAllowed, new Set(Object.keys(queryParams)));
    return ['AMEXPSRTP6MOFREE'].includes(queryParams?.programcode?.toUpperCase()) && invalidParamKeys.length === 0;
});

export const getAllowAmexTransactions = createSelector(featureState, (state) => state.allowAmexTransactions);

export const getOrganicPurchaseDataHasBeenLoaded = createSelector(getSelectedOffer, (selectedOffer) => !!selectedOffer);

export const getPayloadForOffersLoad = createSelector(
    getPromoCode,
    getProgramCode,
    getUserEnteredCredentialsEmail,
    selectAccount,
    getAccountFirstSubscriptionSubscriptionID,
    (marketingPromoCode, programCode, userEnteredEmail, account, subscriptionId) => ({
        request: {
            ...(marketingPromoCode ? { marketingPromoCode } : {}),
            ...(programCode ? { programCode } : {}),
            streaming: true,
            ...(subscriptionId && { subscriptionId: +subscriptionId }),
        },
        useCustomerOfferCall: !!userEnteredEmail || !!account,
    })
);

export const getRedemptionType = createSelector(getAllowAmexTransactions, (allowAmexTransactions) => {
    if (allowAmexTransactions) {
        return 'AMEX';
    }
    return null;
});

export const getSelectedOfferIsRtpPromoOfferPlan = createSelector(getSelectedOffer, (offer) => offer?.type === 'RTP_OFFER' && offer?.marketType === 'self-pay:promo');
export const getCanDisplayEarlyTerminationFeeCopies = createSelector(featureState, ({ canDisplayEarlyTerminationFeeCopies }) => canDisplayEarlyTerminationFeeCopies);

export const getCreditCardOnFileViewModel = createSelector(getAccountBillingSummary, getAccountFirstSubscriptionSubscriptionID, (billingSummary, accountSubscriptionId) => {
    if (billingSummary?.creditCard?.status === 'ACTIVE') {
        return {
            useCardOnFileAllowed: !!accountSubscriptionId,
            cardType: billingSummary.creditCard.type,
            cardNumberLastFour: billingSummary.creditCard.last4Digits,
        };
    }
    return {
        useCardOnFileAllowed: false,
    };
});

export const getAccountFirstSubscriptionFirstPlanIsRtdTrial = createSelector(
    getAccountFirstSubscriptionFirstPlan,
    (plan) => !!(plan?.code?.toUpperCase().match('RTD') || plan?.code?.toUpperCase().match('NOFO'))
);

export const getOfferCodes = createSelector(getPromoCode, getSelectedPlanCode, selectFirstFollowOnOfferPlanCode, (marketingPromoCode, planCode, followonPlancode) => ({
    marketingPromoCode,
    planCode,
    followonPlancode,
}));

export const getPayloadForPurchaseTransaction = createSelector(
    getOfferCodes,
    getUserEnteredCredentials,
    getCustomerInfo,
    getPaymentInfo,
    getCurrentQuote,
    getTransactionIdForSession,
    getDoesAccountHaveAtLeastOneTrial,
    getFirstAccountSubscriptionId,
    (
        { marketingPromoCode, planCode, followonPlancode },
        credentials,
        customerInfo,
        paymentInfo,
        currentQuote,
        transactionIdForSession,
        accountHasAtLeastOneTrialPlan,
        subscriptionId
    ) => {
        const { serviceAddress, billingAddress, ...creditCardInfo } = paymentInfo;
        const [expiryMonth, expiryYear] = creditCardInfo.cardExpirationDate.split('/');
        return {
            ...(marketingPromoCode ? { marketingPromoCode } : {}),
            ...(accountHasAtLeastOneTrialPlan && { followOnPlans: [{ planCode }] }),
            ...(!accountHasAtLeastOneTrialPlan && {
                plans: [{ planCode }],
                followOnPlans: followonPlancode ? [{ planCode: followonPlancode }] : [],
            }),
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
            ...(serviceAddress?.zip && {
                serviceAddress: {
                    streetAddress: serviceAddress.addressLine1,
                    city: serviceAddress.city,
                    state: serviceAddress.state,
                    postalCode: serviceAddress.zip,
                    country: serviceAddress.country,
                    avsvalidated: serviceAddress.avsValidated,
                    firstName: customerInfo.firstName,
                    lastName: customerInfo.lastName,
                    phone: customerInfo.phoneNumber,
                    email: credentials.email,
                    addressType: 'person',
                },
            }),
            ...(billingAddress?.zip && {
                billingAddress: {
                    streetAddress: billingAddress.addressLine1 || ' ',
                    city: billingAddress.city,
                    state: billingAddress.state,
                    postalCode: billingAddress.zip,
                    country: billingAddress.country,
                    avsvalidated: billingAddress.avsValidated,
                    phone: customerInfo.phoneNumber,
                    addressType: 'person',
                },
            }),
            ...(!accountHasAtLeastOneTrialPlan &&
                credentials && {
                    streamingInfo: {
                        emailAddress: credentials.email,
                        firstName: customerInfo.firstName,
                        lastName: customerInfo.lastName,
                        login: credentials.userName || credentials.email,
                        password: credentials.password,
                    },
                }),
            subscriptionId: +subscriptionId,
        };
    }
);

export const getServiceAndBillingAddresAndStreamingInfoPayloadForTargeted = createSelector(
    getCustomerInfo,
    getUserEnteredCredentials,
    getPaymentInfoServiceAddress,
    getPaymentInfoBillingAddress,
    getDoesAccountHaveAtLeastOneTrial,
    (customerInfo, credentials, serviceAddress, billingAddress, accountHasAtLeastOneTrialPlan) => {
        return {
            ...(serviceAddress?.zip && {
                serviceAddress: {
                    streetAddress: serviceAddress?.addressLine1,
                    city: serviceAddress?.city,
                    state: serviceAddress?.state,
                    postalCode: serviceAddress?.zip,
                    country: serviceAddress?.country,
                    avsvalidated: serviceAddress?.avsValidated,
                    firstName: customerInfo?.firstName,
                    lastName: customerInfo?.lastName,
                    phone: customerInfo?.phoneNumber,
                    email: credentials?.email,
                    addressType: 'person',
                },
            }),
            ...(billingAddress?.zip && {
                serviceAddress: {
                    streetAddress: billingAddress?.addressLine1 || ' ',
                    city: billingAddress?.city,
                    state: billingAddress?.state,
                    postalCode: billingAddress?.zip,
                    country: billingAddress?.country,
                    avsvalidated: billingAddress?.avsValidated,
                    phone: customerInfo?.phoneNumber,
                    addressType: 'person',
                },
            }),
            ...(!accountHasAtLeastOneTrialPlan &&
                credentials && {
                    streamingInfo: {
                        emailAddress: credentials.email,
                        firstName: customerInfo?.firstName,
                        lastName: customerInfo?.lastName,
                        login: credentials.userName || credentials.email,
                        password: credentials.password,
                    },
                }),
        };
    }
);

const getServiceAndBillingAddresAndStreamingInfoPayloadForTargetedMrd = createSelector(
    getCustomerInfo,
    getUserEnteredCredentials,
    getPaymentInfoServiceAddress,
    getPaymentInfoBillingAddress,
    (customerInfo, credentials, serviceAddress) => {
        return {
            ...(serviceAddress?.zip && {
                serviceAddress: {
                    streetAddress: serviceAddress?.addressLine1,
                    city: serviceAddress?.city,
                    state: serviceAddress?.state,
                    postalCode: serviceAddress?.zip,
                    country: serviceAddress?.country,
                    avsvalidated: serviceAddress?.avsValidated,
                    firstName: customerInfo?.firstName,
                    lastName: customerInfo?.lastName,
                    phone: customerInfo?.phoneNumber,
                    email: credentials?.email,
                    addressType: 'person',
                },
            }),
            ...(credentials && {
                streamingInfo: {
                    emailAddress: credentials.email,
                    firstName: customerInfo?.firstName,
                    lastName: customerInfo?.lastName,
                    login: credentials.userName || credentials.email,
                    password: credentials.password,
                },
            }),
        };
    }
);

export const getPayloadForPurchaseTargetedTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getCurrentQuote,
    getTransactionIdForSession,
    getDoesAccountHaveAtLeastOneTrial,
    getFirstAccountSubscriptionId,
    getServiceAndBillingAddresAndStreamingInfoPayloadForTargeted,
    (planCode, paymentInfo, currentQuote, transactionIdForSession, accountHasAtLeastOneTrialPlan, subscriptionId, serviceAddresAndStreamingInfoPayloadForTargeted) => {
        const { serviceAddress, ...creditCardInfo } = paymentInfo;
        const creditCardOnFile = !creditCardInfo.cardNumber;
        const splittedCreditCardInfo = creditCardInfo?.cardExpirationDate?.split('/');
        const expiryMonth = splittedCreditCardInfo?.[0];
        const expiryYear = splittedCreditCardInfo?.[1];
        const creditCardInfoPayload = !creditCardOnFile
            ? {
                  cardInfo: {
                      nameOnCard: creditCardInfo.nameOnCard,
                      cardNumber: +creditCardInfo.cardNumber,
                      expiryMonth: +expiryMonth,
                      expiryYear: +expiryYear,
                      securityCode: creditCardInfo.cvv,
                  },
              }
            : null;
        return {
            ...(!accountHasAtLeastOneTrialPlan && { plans: [{ planCode }] }),
            ...(accountHasAtLeastOneTrialPlan && { followOnPlans: [{ planCode }] }),
            paymentInfo: {
                useCardOnfile: creditCardOnFile,
                ...(!creditCardOnFile && { paymentType: 'creditCard' }),
                ...(creditCardInfoPayload && creditCardInfoPayload),
                ...(!creditCardOnFile && { transactionId: transactionIdForSession }),
                giftCards: [paymentInfo.giftCard],
                paymentAmount:
                    currentQuote && (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') && Math.sign(currentQuote.currentBalance + 0) === 1
                        ? currentQuote.currentBalance
                        : null,
            },
            subscriptionId,
            ...serviceAddresAndStreamingInfoPayloadForTargeted,
        };
    }
);

export const getPayloadForPurchaseTargetedAddStreamingTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getCurrentQuote,
    getTransactionIdForSession,
    getFirstAccountSubscriptionId,
    getServiceAndBillingAddresAndStreamingInfoPayloadForTargetedMrd,
    (planCode, paymentInfo, currentQuote, transactionIdForSession, subscriptionId, serviceAddresAndStreamingInfoPayloadForTargeted) => {
        const { serviceAddress, ...creditCardInfo } = paymentInfo;
        const creditCardOnFile = !creditCardInfo.cardNumber;
        const splittedCreditCardInfo = creditCardInfo?.cardExpirationDate?.split('/');
        const expiryMonth = splittedCreditCardInfo?.[0];
        const expiryYear = splittedCreditCardInfo?.[1];
        const creditCardInfoPayload = !creditCardOnFile
            ? {
                  cardInfo: {
                      nameOnCard: creditCardInfo.nameOnCard,
                      cardNumber: +creditCardInfo.cardNumber,
                      expiryMonth: +expiryMonth,
                      expiryYear: +expiryYear,
                      securityCode: creditCardInfo.cvv,
                  },
              }
            : null;
        return {
            plans: [{ planCode }],
            paymentInfo: {
                useCardOnfile: creditCardOnFile,
                ...(!creditCardOnFile && { paymentType: 'creditCard' }),
                ...(creditCardInfoPayload && creditCardInfoPayload),
                ...(!creditCardOnFile && { transactionId: transactionIdForSession }),
                giftCards: [paymentInfo.giftCard],
                paymentAmount:
                    currentQuote && (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') && Math.sign(currentQuote.currentBalance + 0) === 1
                        ? currentQuote.currentBalance
                        : null,
            },
            subscriptionId,
            ...serviceAddresAndStreamingInfoPayloadForTargeted,
        };
    }
);

export const getPayloadForMrdPurchaseTargetedTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getCurrentQuote,
    getTransactionIdForSession,
    getFirstAccountSubscriptionId,
    getServiceAndBillingAddresAndStreamingInfoPayloadForTargetedMrd,
    (planCode, paymentInfo, currentQuote, transactionIdForSession, subscriptionId, serviceAddresAndStreamingInfoPayloadForTargeted) => {
        const { serviceAddress, ...creditCardInfo } = paymentInfo;
        const creditCardOnFile = !creditCardInfo.cardNumber;
        const splittedCreditCardInfo = creditCardInfo?.cardExpirationDate?.split('/');
        const expiryMonth = splittedCreditCardInfo?.[0];
        const expiryYear = splittedCreditCardInfo?.[1];
        const creditCardInfoPayload = !creditCardOnFile
            ? {
                  cardInfo: {
                      nameOnCard: creditCardInfo.nameOnCard,
                      cardNumber: +creditCardInfo.cardNumber,
                      expiryMonth: +expiryMonth,
                      expiryYear: +expiryYear,
                      securityCode: creditCardInfo.cvv,
                  },
              }
            : null;
        return {
            plans: [{ planCode }],
            paymentInfo: {
                useCardOnfile: creditCardOnFile,
                ...(!creditCardOnFile && { paymentType: 'creditCard' }),
                ...(creditCardInfoPayload && creditCardInfoPayload),
                ...(!creditCardOnFile && { transactionId: transactionIdForSession }),
                giftCards: [paymentInfo.giftCard],
                paymentAmount:
                    currentQuote && (currentQuote.currentBalance !== 0 || currentQuote.currentBalance.toString() !== '') && Math.sign(currentQuote.currentBalance + 0) === 1
                        ? currentQuote.currentBalance
                        : null,
            },
            subscriptionId,
            ...serviceAddresAndStreamingInfoPayloadForTargeted,
        };
    }
);

const getCreditCardType = createSelector(getPaymentInfo, (paymentInfo) => paymentInfo?.cardType);

export const getSelectedOfferIsFallback = createSelector(getSelectedOffer, (offer) => offer?.fallback);
export const getSelectedOfferFallbackReason = createSelector(getSelectedOffer, (offer) => offer?.fallbackReason);
export const getSelectedOfferFallbackInfo = createSelector(getSelectedOfferIsFallback, getSelectedOfferFallbackReason, (isFallback, reason) => ({ isFallback, reason }));

export const getSelectedOfferOfferInfoDetails = createSelector(getSelectedPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return offersInfo[planCode];
});
export const getSelectedOfferOfferInfoOfferDescription = createSelector(getSelectedOfferOfferInfoDetails, (offerInfo) => {
    if (offerInfo?.offerDescription) {
        const { offerDescription, packageDescription, presentation } = offerInfo;
        // TODO: eventually update this with remaining props needed for primary package card when we are ready to support more plans
        return {
            platformPlan: packageDescription.packageName,
            priceAndTermDescTitle: offerDescription.priceAndTermDescTitle,
            processingFeeDisclaimer: offerDescription.processingFeeDisclaimer,
            icons: null,
            details: packageDescription.highlightsText,
            footer: null,
            theme: presentation.theme,
            presentation: presentation.style,
        };
    }
});

export const getPaymentInterstitialBulletsViewModel = createSelector(getSelectedOfferOfferInfoDetails, (offerInfo) => offerInfo?.paymentInterstitialBullets || []);

export const getSelectedOfferOfferInfoLegalCopy = createSelector(
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    getSelectedPlanCode,
    (offerInfos, planCode) => offerInfos?.[planCode]
);

export const getSelectedOfferEtf = createSelector(getSelectedOffer, (getSelectedOffer) => {
    const etfAmount = getSelectedOffer?.deal?.etfAmount;
    const etfTerm = getSelectedOffer?.deal?.etfTerm;
    return etfAmount && etfTerm ? { etfAmount, etfTerm } : null;
});

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
export const getQuoteRequestData = createSelector(
    getSelectedPlanCode,
    getPaymentInfoServiceAddress,
    selectFirstFollowOnOfferPlanCode,
    getFirstAccountSubscriptionId,
    (planCode, serviceAddress, followOnPlancode, subscriptionId) => ({
        ...(followOnPlancode && { followOnPlanCodes: [followOnPlancode] }),
        planCodes: [planCode],
        ...(serviceAddress?.zip && {
            serviceAddress: {
                streetAddress: serviceAddress?.addressLine1,
                city: serviceAddress?.city,
                state: serviceAddress?.state,
                postalCode: serviceAddress?.zip,
                country: serviceAddress?.country,
            },
        }),
        subscriptionId,
    })
);

export const getMrdQuoteRequestData = createSelector(getSelectedPlanCode, (planCode) => ({
    planCodes: [planCode],
}));

export const getTargetedQuoteRequestData = createSelector(
    getSelectedPlanCode,
    getFirstAccountSubscriptionId,
    getPaymentInfoServiceAddress,
    (planCode, subscriptionId, serviceAddress) => ({
        planCodes: [planCode],
        ...(serviceAddress?.zip && {
            serviceAddress: {
                streetAddress: serviceAddress?.addressLine1,
                city: serviceAddress?.city,
                state: serviceAddress?.state,
                postalCode: serviceAddress?.zip,
                country: serviceAddress?.country,
            },
        }),
        subscriptionId,
    })
);

export const getCampaignIdFromQueryParams = createSelector(getNormalizedQueryParams, ({ utm_content }) => utm_content);
export const getStreamingProspectTokenFromQueryParams = createSelector(getNormalizedQueryParams, ({ tkn, cnatkn }) => {
    if (cnatkn) {
        return { token: cnatkn, tokenType: 'STREAMING_WINBACK' };
    } else if (tkn) {
        return { token: tkn, tokenType: 'PROSPECT_USERNAME' };
    }
    return null;
});

export const getAmexOfferRedeemedData = createSelector(
    getAllowAmexTransactions,
    getCreditCardType,
    getSelectedOfferIsFallback,
    (allowAmexTransactions, creditCardType, selectedOfferIsFallback) => {
        if (!allowAmexTransactions || selectedOfferIsFallback) {
            return null;
        }
        const paymentType = creditCardType?.toUpperCase() !== 'AMEX' ? 'OTHER' : 'AMEX';
        return { payment_type: paymentType, order_cost: '0', currency: 'USD' };
    }
);
export const getStreamingAccountState = createSelector(
    getAccountServiceAddressState,
    getSelectedProvinceCode,
    (currentAccountState, selectedState) => currentAccountState || selectedState
);
export const getParamsForCustomerOffersForPurchaseDataFromToken = createSelector(getStreamingAccountState, getNormalizedQueryParams, (state, { programcode }) => ({
    state,
    programcode,
}));

export const getFailedEligibilityCheck = createSelector(featureState, (state) => state.failedEligibilityCheck);
export {
    getSelectedPlanCode,
    getPaymentInfo,
    getPlanRecapCardViewModel,
    getSelectedOfferChannelCount,
    getSelectedOfferPlatformAndPlanName,
    getSelectedOfferPriceAndTermInfo,
    getLongDescriptionPlanRecapCardViewModel,
};

export const getCurrentUserViewModel = createSelector(selectAccount, getMaskedUserNameFromToken, (account, maskedUserNameFromToken) => {
    if (account && maskedUserNameFromToken) {
        return {
            maskedUserNameFromToken,
        };
    }
});

export const getMonthlyOffers = createSelector(getAllOffersAsArray, (offers) => offers.filter((offer) => offer.termLength === 1));

export const getPaymentFormType = createSelector(featureState, (state) => state.paymentFormType);
