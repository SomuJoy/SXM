import { createSelector } from '@ngrx/store';
import {
    featureState,
    getCampaignIdFromQueryParams,
    getSelectedOfferChannelCount,
    getSelectedOfferFallbackInfo,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferPlatformAndPlanName,
    getSelectedOfferPriceAndTermInfo,
    getTransactionData,
    getTransactionSubscriptionId,
    getUserEnteredCredentialsEmail,
    getUserPickedAPlanCode,
    getFailedEligibilityCheck,
    getSelectedOfferIsRtpPromoOfferPlan,
    getProgramCode,
    getMonthlyOffers,
    getCreditCardOnFileViewModel,
    getAccountFirstSubscriptionFirstPlanIsRtdTrial,
    getSelectedOfferEtf,
    getCanDisplayEarlyTerminationFeeCopies,
    getPaymentFormType,
    getCurrentUserViewModel,
} from './selectors';
import {
    getAccountFirstSubscriptionFirstTrialPlan,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    getAccountHasSubscription,
    getAccountSubscriptions,
    getDoesAccountHaveAtLeastOneSelfPay,
    getDoesAccountHaveAtLeastOneTrial,
} from '@de-care/domains/account/state-account';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import {
    getNuCaptchaRequired,
    getSelectedPlanCode,
    getSelectedProvinceCode,
    getSelectedOfferDealCopy,
    getSelectedOffer,
    getPaymentInfo,
    getCustomerInfo,
    getSelectedPlanDealType,
    getUserEnteredCredentials,
    getLongDescriptionPlanRecapCardViewModel,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getCampaignsHeroContentMappedByCampaignId } from '@de-care/domains/cms/state-campaigns';
import { getAllOffersAsArray, getConfiguredLeadOfferOrFirstOffer, getFirstOfferIsFallback } from '@de-care/domains/offers/state-offers';
import { selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getSessionInfoId } from '@de-care/domains/utility/state-environment-info';
import { getTermUpsellOffer } from '@de-care/domains/offers/state-upsells';
import { selectUpsellOfferInfosForCurrentLocaleMappedByLeadOfferPlanCode } from '@de-care/domains/offers/state-upsell-offers-info';

export { getAccountServiceAddressState as getAccountProvinceCode } from '@de-care/domains/account/state-account';
export { getSelectedPlanDealType } from '@de-care/de-care-use-cases/checkout/state-common';
export { getSelectedOfferFallbackReasonInfo, getUserEnteredCredentials } from '@de-care/de-care-use-cases/checkout/state-common';

export const getCampaignHeroViewModel = createSelector(getCampaignIdFromQueryParams, getCampaignsHeroContentMappedByCampaignId, (campaignId, campaignsById) => {
    const heroContent = campaignsById?.[campaignId];
    if (!heroContent) {
        return null;
    }
    return {
        heroForegroundImageUrl: heroContent?.heroForegroundImage,
        heroBackgroundImageUrl: heroContent?.heroBackgroundImage,
        heroImageAltText: heroContent?.heroHeadline,
    };
});

export const getAugementedDealOfferCopy = createSelector(getSelectedOfferDealCopy, getSelectedPlanDealType, (selectedOfferDealCopy, dealType) =>
    getSelectedOfferDealCopy ? { deals: selectedOfferDealCopy, dealType } : null
);

export const getPaymentPostTrialViewModel = createSelector(
    getAccountFirstSubscriptionFirstTrialPlan,
    getSelectedOfferIsRtpPromoOfferPlan,
    getAccountFirstSubscriptionFirstPlanIsRtdTrial,
    (trialPlan, selectedOfferIsRtpPlan, firstSubscriptionPlanIsRtdTrial) => {
        if (!trialPlan) {
            return null;
        }
        let type = 'DEFAULT';

        if (selectedOfferIsRtpPlan && !firstSubscriptionPlanIsRtdTrial) {
            type = 'PLAN_STARTS_AFTER_PROMO';
        }

        return {
            type,
            trialEndDate: trialPlan.endDate,
        };
    }
);

const getSelectedOfferInfo = createSelector(
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferPlatformAndPlanName,
    getSelectedOfferChannelCount,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferPriceAndTermInfo,
    (offerDescription, platformAndPlanName, channelCount, legalCopy, priceAndTerm) => ({
        offerDescription,
        platformAndPlanName,
        channelCount,
        legalCopy,
        priceAndTerm,
    })
);

export const getOrganicSelectedOfferViewModel = createSelector(
    getSelectedOfferInfo,
    getSelectedOfferFallbackInfo,
    getSelectedPlanCode,
    getProgramCode,
    getAugementedDealOfferCopy,
    ({ offerDescription, platformAndPlanName, channelCount, legalCopy, priceAndTerm }, fallbackInfo, planCode, programCode, augmentedDealOfferCopy) => ({
        offerDescription: {
            ...offerDescription,
            ...(planCode === 'Trial - Premier Streaming - 3mo - $0.00'
                ? {
                      processingFeeDisclaimer: offerDescription?.processingFeeDisclaimer.replace('<br', ' <br>Cancel online anytime.<br'),
                      details: offerDescription?.details.map((detail) => detail.replace('<br>', '. ').replace('<sub>', '').replace('</sub>', '')),
                  }
                : {}),
            openLeadOfferDetails: offerDescription?.presentation === 'Presentation2' || offerDescription?.presentation === 'Presentation5',
            // TODO: this logic should be handled by CMS, this is just a temp fix.
            nonRetailMode: augmentedDealOfferCopy?.dealType === 'AMZ_DOT' && priceAndTerm?.termLength < 12 && offerDescription?.theme === 'Theme2',
        },
        platformAndPlanName,
        channelCount,
        legalCopy,
        ...priceAndTerm,
        ...(programCode ? { isFallbackOffer: fallbackInfo?.isFallback, fallbackReason: fallbackInfo?.reason } : {}),
        useOfferWithDealPresentment: augmentedDealOfferCopy?.dealType === 'AMZ_DOT',
        offerDealCopy: augmentedDealOfferCopy?.deals,
    })
);

export const getSelectedOfferViewModel = createSelector(getOrganicSelectedOfferViewModel, getPaymentPostTrialViewModel, (viewModel, paymentPostTrialViewModel) => ({
    ...viewModel,
    paymentPostTrialViewModel,
}));

export const getSelectedOfferIsStepUpPlan = createSelector(getSelectedOffer, (offer) => offer?.type === 'STEP_UP');

export const getReviewPostTrialViewModel = createSelector(
    getDoesAccountHaveAtLeastOneTrial,
    getQuote,
    getSelectedOfferIsStepUpPlan,
    getAccountFirstSubscriptionFirstPlanIsRtdTrial,
    getSelectedOfferEtf,
    getCanDisplayEarlyTerminationFeeCopies,
    (accountHaveAtLeastOneTrial, quote, selectedOfferIsStepUpPlan, isRtdTrial, isEtfOffer, canDisplayEarlyTerminationFeeCopies) => {
        const futureQuote = quote?.futureQuote;
        if ((isRtdTrial || (selectedOfferIsStepUpPlan && accountHaveAtLeastOneTrial)) && futureQuote) {
            let type = 'DEFAULT';
            if (isRtdTrial && (!isEtfOffer || canDisplayEarlyTerminationFeeCopies)) {
                type = 'RTD';
            }
            const futureQuoteDetails = futureQuote.details;
            return {
                futureCharge: futureQuote.totalAmount,
                startDate: futureQuoteDetails[0]?.startDate,
                type,
            };
        }
    }
);

export const getSelectedOfferForReviewStepViewModel = createSelector(
    getSelectedOfferViewModel,
    getFailedEligibilityCheck,
    getSelectedOfferEtf,
    getReviewPostTrialViewModel,
    (selectedOfferViewModel, failedEligibilityCheck, isEarlyTerminationFee, reviewPostTrialViewModel) => ({
        ...selectedOfferViewModel,
        showAlternateOfferAlert: failedEligibilityCheck,
        showCancelAnytimeTextCopy: !isEarlyTerminationFee,
        reviewPostTrialViewModel,
    })
);

export const getSelectedPlanDealViewModelForAmazon = createSelector(getTransactionData, getSessionInfoId, (transactionData, sessionId) => ({
    subscriptionId: transactionData.subscriptionId,
    sessionId,
}));

export const getUserEnteredDataForOrganicCredentials = createSelector(getUserEnteredCredentials, (credentials) => ({
    email: credentials?.email,
    password: credentials?.password,
}));
export const getUserEnteredDataForOrganicPaymentInfo = createSelector(getCustomerInfo, getPaymentInfo, (customerInfo, paymentInfo) =>
    customerInfo && paymentInfo
        ? {
              firstName: customerInfo?.firstName,
              lastName: customerInfo?.lastName,
              phoneNumber: customerInfo?.phoneNumber,
              serviceAddress: paymentInfo?.serviceAddress,
              creditCard: {
                  nameOnCard: paymentInfo?.nameOnCard,
                  cardNumber: paymentInfo?.cardNumber,
                  expirationDate: paymentInfo?.cardExpirationDate,
              },
          }
        : null
);

const getActiveStreamingSubscriptions = createSelector(getAccountSubscriptions, (subscriptions) =>
    Array.isArray(subscriptions) ? subscriptions?.filter((subscription) => subscription?.streamingService?.status.toLowerCase() === 'active') : []
);

export const getActiveStreamingSubscriptionViewModel = createSelector(
    getActiveStreamingSubscriptions,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (subscriptions, packageDescriptions) => {
        const subscriptionsMapped = subscriptions.map((subscription) => ({
            id: subscription.id,
            maskedEmail: subscription.streamingService.maskedUserName,
            planName: packageDescriptions?.[subscription.plans[0].packageName]?.name,
            requiresSubscription:
                !subscription.radioService &&
                subscription.plans[0].type.toUpperCase() === 'TRIAL' &&
                (!Array.isArray(subscription.followonPlans) || subscription?.followonPlans?.length === 0),
        }));
        return {
            streaming: subscriptionsMapped.filter((subscription) => !subscription.requiresSubscription).map(({ requiresSubscription, ...sub }) => sub),
            trials: subscriptionsMapped.filter((subscription) => subscription.requiresSubscription).map(({ requiresSubscription, ...sub }) => sub),
        };
    }
);

export const getQuoteViewModel = createSelector(getQuote, (quote) => {
    if (!quote) {
        return null;
    }
    const promoRenewalQuote = quote.promoRenewalQuote;
    const modifiedQuote = {
        ...quote,
        renewalQuote: {
            ...quote.renewalQuote,
            collapsed: true,
        },
        ...(promoRenewalQuote && {
            promoRenewalQuote: {
                ...promoRenewalQuote,
                displayInAccordion: false,
                hideQstgst: true,
            },
        }),
    };
    const detailWithDiscoveryDeal = modifiedQuote.currentQuote?.details.find((detail) => detail.dealType === 'DISCOVERY_PLUS');
    const detailWithAmzDotDeal = modifiedQuote.currentQuote?.details.find((detail) => detail.dealType === 'AMZ_DOT');
    const detailWithGiftCard = modifiedQuote.currentQuote?.details.find((detail) => detail.balanceType === 'GIFT_CARD');
    if (detailWithAmzDotDeal) {
        modifiedQuote.currentQuote = {
            ...quote.currentQuote,
            details: [
                {
                    ...detailWithAmzDotDeal,
                },
                {
                    ...detailWithAmzDotDeal,
                    packageName: detailWithAmzDotDeal.dealType,
                    priceAmount: 0,
                    termLength: -1,
                },
                ...(detailWithGiftCard
                    ? [
                          {
                              ...detailWithGiftCard,
                          },
                      ]
                    : []),
            ],
        };
    }
    if (detailWithDiscoveryDeal) {
        modifiedQuote.currentQuote = {
            ...quote.currentQuote,
            details: [
                {
                    ...detailWithDiscoveryDeal,
                    dealType: null,
                },
                {
                    ...detailWithDiscoveryDeal,
                    dealType: null,
                    packageName: detailWithDiscoveryDeal.dealType,
                    priceAmount: 0,
                    termLength: 1,
                },
                ...(detailWithGiftCard
                    ? [
                          {
                              ...detailWithGiftCard,
                          },
                      ]
                    : []),
            ],
        };
    }
    return modifiedQuote;
});

export const getQuoteViewModelForTargeted = createSelector(getQuote, (quote) => {
    if (!quote) {
        return null;
    }
    const promoRenewalQuote = quote.promoRenewalQuote;
    const modifiedQuote = {
        ...quote,
        renewalQuote: {
            ...quote.renewalQuote,
            collapsed: true,
        },
        ...(promoRenewalQuote && {
            promoRenewalQuote: {
                ...promoRenewalQuote,
                displayInAccordion: false,
                hideQstgst: true,
            },
        }),
    };
    const detailWithAmzDotDeal = modifiedQuote.currentQuote?.details.find((detail) => detail.dealType === 'AMZ_DOT');
    const detailWithGiftCard = modifiedQuote.currentQuote?.details.find((detail) => detail.balanceType === 'GIFT_CARD');
    if (detailWithAmzDotDeal) {
        modifiedQuote.currentQuote = {
            ...quote.currentQuote,
            details: [
                {
                    ...detailWithAmzDotDeal,
                },
                {
                    ...detailWithAmzDotDeal,
                    packageName: detailWithAmzDotDeal.dealType,
                    priceAmount: 0,
                    termLength: -1,
                } as any,
                ...(detailWithGiftCard
                    ? [
                          {
                              ...detailWithGiftCard,
                          },
                      ]
                    : []),
            ],
        };
    }
    return modifiedQuote;
});
export const getShouldIncludeNuCaptcha = createSelector(getNuCaptchaRequired, (required) => required);

export const getRegistrationViewModel = createSelector(
    getSecurityQuestions,
    getUserEnteredCredentialsEmail,
    getTransactionData,
    (securityQuestions, email, transactionData) => {
        if (transactionData?.isEligibleForRegistration && securityQuestions?.length > 0 && email) {
            return {
                securityQuestions,
                accountInfo: {
                    email,
                    useEmailAsUsername: false,
                    firstName: '',
                    hasUserCredentials: false,
                    hasExistingAccount: false,
                    isOfferStreamingEligible: transactionData.isOfferStreamingEligible,
                    isEligibleForRegistration: transactionData.isEligibleForRegistration,
                    subscriptionId: transactionData.subscriptionId,
                },
            };
        } else {
            return null;
        }
    }
);

export const getListenNowTokenViewModel = createSelector(getTransactionSubscriptionId, (subscriptionId) => ({
    subscriptionId: subscriptionId?.toString(),
    useCase: '',
}));

export const getOfferIncludesFees = createSelector(getSelectedOfferPriceAndTermInfo, getSelectedProvinceCode, (offer, selectedProvinceCode) => {
    if (offer?.price === 0 && offer?.retailPricePerMonth === 0) {
        return false;
    } else if (selectedProvinceCode?.length > 0 && selectedProvinceCode?.toLowerCase() !== 'qc' && offer?.retailPricePerMonth !== 0) {
        return true;
    } else {
        return false;
    }
});

export const getQuebecProvince = createSelector(getSelectedProvinceCode, (selectedProvinceCode) => {
    if (selectedProvinceCode?.toLowerCase() === 'qc') {
        return true;
    } else {
        return false;
    }
});

export const getOffersMrdSelectionData = createSelector(getAllOffersAsArray, selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode, (offers, offerDescription) => {
    const mainPackageData = offers?.map((offer) => {
        return {
            isBestPackage: offer.bestPackage,
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
});

export const getOffersAddSelectionData = createSelector(getMonthlyOffers, selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode, (offers, offerDescription) => {
    const mainOffers = offers?.slice(0, 2).map((offer) => {
        return {
            isBestPackage: offer.bestPackage,
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
    const additionalOffers = offers?.slice(2).map((offer) => {
        return {
            isBestPackage: offer.bestPackage,
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
        mainOffers,
        additionalOffers,
    };
});

export const getSelectedPlanMrdEligible = createSelector(getSelectedOffer, (offer) => !!offer.mrdEligible);
export const getAddStreamingTransactionStateExists = createSelector(getUserPickedAPlanCode, (userPickedAPlanCode) => !!userPickedAPlanCode);
export const mrdTransactionStateExists = createSelector(getUserPickedAPlanCode, (userPickedAPlanCode) => !!userPickedAPlanCode);
export const getOffersAreMrd = createSelector(getAllOffersAsArray, (offers) => offers.some((offer) => offer.mrdEligible));
// TODO: construct a selector for MRD page view model.
export {
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedPlanCode,
    getPaymentInfo,
    getSelectedOfferEtf,
    getPlanRecapCardViewModel,
    getLongDescriptionPlanRecapCardViewModel,
    getPaymentInterstitialBulletsViewModel,
    getCreditCardOnFileViewModel,
    getCurrentUserViewModel,
} from './selectors';
export const getSelectedPlanIsMusicShowcase = createSelector(getSelectedOffer, (offer) => (offer?.packageName === 'SIR_IP_SHOWCASE' ? true : false));
export const getSelectedPlanIsStreamingPlatinum = createSelector(getSelectedOffer, (offer) => (offer?.packageName === 'SIR_IP_SA' ? true : false));

export const getProspectTokenData = createSelector(featureState, ({ prospectTokenData }) => prospectTokenData);

export const getPaymentFormInitialState = createSelector(getUserEnteredDataForOrganicPaymentInfo, getProspectTokenData, (paymentInfo, prospectTokenData) => {
    if (paymentInfo) {
        return {
            firstName: paymentInfo?.firstName,
            lastName: paymentInfo?.lastName,
            phoneNumber: paymentInfo?.phoneNumber,
            address: {
                addressLine1: paymentInfo?.serviceAddress?.addressLine1,
                city: paymentInfo?.serviceAddress?.city,
                state: paymentInfo?.serviceAddress?.state,
                zip: paymentInfo?.serviceAddress?.zip,
            },
            creditCard: paymentInfo?.creditCard,
        };
    } else if (prospectTokenData) {
        return {
            firstName: prospectTokenData?.firstName,
            lastName: prospectTokenData?.lastName,
            phoneNumber: prospectTokenData?.phone,
            address: {
                addressLine1: prospectTokenData?.streetAddress,
                city: prospectTokenData?.city,
                state: prospectTokenData?.state,
                zip: prospectTokenData?.zipCode,
            },
            creditCard: null,
        };
    }
    return null;
});

export const organicTransactionStateExists = createSelector(
    getUserEnteredCredentials,
    getAccountHasSubscription,
    (userEnteredCredentials, accountHasSubscriptions) => (!!userEnteredCredentials?.email && !!userEnteredCredentials?.password) || accountHasSubscriptions
);

export const getIsRtpOrStepUpPlan = createSelector(
    getSelectedOfferIsStepUpPlan,
    getSelectedOfferIsRtpPromoOfferPlan,
    (selectedOfferIsStepUpPlan, selectedOfferIsRtpPlan) => selectedOfferIsStepUpPlan || selectedOfferIsRtpPlan
);

export const targetedTransactionExists = createSelector(getPaymentInfo, (paymentInfo) => !!paymentInfo);

export { getDoesAccountHaveAtLeastOneTrial as getAccountHasAtLeastOneTrialSubscriptionPlan } from '@de-care/domains/account/state-account';
export const termUpsellIsAvailable = createSelector(getTermUpsellOffer, (upsellOffer) => upsellOffer);

export const termUpsellOptionsViewModel = createSelector(
    getConfiguredLeadOfferOrFirstOffer,
    getTermUpsellOffer,
    selectUpsellOfferInfosForCurrentLocaleMappedByLeadOfferPlanCode,
    (offer, termUpsellOffer, upsellOffersInfoByLeadOfferPlanCode) => {
        if (termUpsellOffer) {
            const upsellOffersInfo = upsellOffersInfoByLeadOfferPlanCode?.[offer.planCode];
            const termUpsellOfferInfo = upsellOffersInfo?.termUpsellOfferInfo;
            const upsellDeal = termUpsellOfferInfo?.upsellDeals?.[0];
            return {
                currentOfferOption: {
                    termLength: offer.termLength,
                    price: offer.price,
                    planCode: offer.planCode,
                },
                termOfferOption: {
                    termLength: termUpsellOffer.termLength,
                    price: termUpsellOffer.price,
                    planCode: termUpsellOffer.planCode,
                    description: termUpsellOfferInfo.title,
                    legalCopy: termUpsellOfferInfo.copy,
                    ...(termUpsellOffer.deal && upsellDeal
                        ? {
                              deal: {
                                  header: upsellDeal.header,
                                  deviceImage: upsellDeal.deviceImage,
                              },
                          }
                        : {}),
                },
            };
        } else {
            return null;
        }
    }
);

export const getSelectedOfferOfferInfoLegalCopyIfUpsellIsAvailable = createSelector(termUpsellIsAvailable, getSelectedOfferOfferInfoLegalCopy, (avaliable, legalCopy) =>
    avaliable ? legalCopy : null
);

export const getSelectedOfferIsMrd = createSelector(getSelectedOffer, (offer) => offer?.mrdEligible);

export const getConfirmationDataForOrganic = createSelector(
    getListenNowTokenViewModel,
    getSelectedPlanDealType,
    getSelectedOfferIsStepUpPlan,
    getRegistrationViewModel,
    getQuebecProvince,
    getAccountFirstSubscriptionFirstPlanIsRtdTrial,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    (
        listenNowTokenViewModel,
        selectedPlanDealType,
        selectedOfferIsStepUpPlan,
        registrationViewModel,
        isQuebecProvince,
        accountIsInRtdTrial,
        streamingServiceMaskedUsername
    ) => ({
        listenNowTokenViewModel,
        selectedPlanDealType,
        selectedOfferIsStepUpPlan,
        registrationViewModel,
        isQuebecProvince,
        ...(accountIsInRtdTrial && { streamingServiceMaskedUsername }),
    })
);

export const getTargetedPostLoadPurchaseDataInfo = createSelector(
    getDoesAccountHaveAtLeastOneSelfPay,
    getFirstOfferIsFallback,
    getAllOffersAsArray,
    getSelectedOfferIsRtpPromoOfferPlan,
    (accountHasAtLeastOneSelfPay, firstOfferIsFallback, offersArray, selectedOfferIsRtpPromo) => ({
        hasOneSelfPay: accountHasAtLeastOneSelfPay,
        offerIsFallback: firstOfferIsFallback,
        noOffersPresented: offersArray.length === 0,
        selectedOfferIsRtpPromo,
    })
);

const getOfferInfo = createSelector(
    getLongDescriptionPlanRecapCardViewModel,
    getSelectedOfferOfferInfoLegalCopyIfUpsellIsAvailable,
    termUpsellIsAvailable,
    getFirstOfferIsFallback,
    getSelectedOfferEtf,
    (longDescriptionPlanRecapCardViewModel, selectedOfferOfferInfoLegalCopyIfUpsellIsAvailable, termUpsellIsAvailable, firstOfferIsFallback, isEarlyTerminationFee) => ({
        longDescriptionPlanRecapCardViewModel,
        selectedOfferOfferInfoLegalCopyIfUpsellIsAvailable,
        termUpsellIsAvailable,
        firstOfferIsFallback,
        isEarlyTerminationFee,
    })
);

const getOrganicpaymentFormMode = createSelector(
    getAccountFirstSubscriptionFirstPlanIsRtdTrial,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    getPaymentFormType,
    (isRtdTrial, streamingServiceMaskedUsername, paymentFormType) => {
        if (streamingServiceMaskedUsername) {
            const tail = isRtdTrial ? `_${paymentFormType}` : '';
            return `IDENTIFIED_USER${tail}`;
        }
        return paymentFormType;
    }
);

export const getOrganicPaymentViewModel = createSelector(
    getOfferInfo,
    getPaymentFormInitialState,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    getPaymentPostTrialViewModel,
    getOrganicpaymentFormMode,
    (
        { longDescriptionPlanRecapCardViewModel, selectedOfferOfferInfoLegalCopyIfUpsellIsAvailable, termUpsellIsAvailable, firstOfferIsFallback, isEarlyTerminationFee },
        paymentFormInitialState,
        streamingServiceMaskedUsername,
        paymentPostTrialViewModel,
        paymentFormMode
    ) => ({
        longDescriptionPlanRecapCardViewModel,
        paymentFormInitialState,
        termUpsellIsAvailable,
        offerInfoLegalCopy: selectedOfferOfferInfoLegalCopyIfUpsellIsAvailable,
        showAlternateOfferAlert: firstOfferIsFallback,
        streamingServiceMaskedUsername,
        paymentFormMode: paymentFormMode,
        paymentPostTrialViewModel,
        showCancelAnytimeTextCopy: !isEarlyTerminationFee,
    })
);

export const pickAPlanTermBillingPlanModel = createSelector(getSelectedOffer, getAllOffersAsArray, (selectedOffer, offers) => {
    if (!selectedOffer) return null;
    return offers
        .filter((offer) => selectedOffer.packageName === offer.packageName)
        .map((offer) => ({
            termLength: offer.termLength,
            price: offer.price,
            planCode: offer.planCode,
        }));
});

export const getAddStreamingPaymentViewModel = createSelector(
    getPaymentInfo,
    getCreditCardOnFileViewModel,
    getSelectedOfferOfferInfoLegalCopy,
    pickAPlanTermBillingPlanModel,
    (paymentInfo, creditCardOnFileViewModel, legalCopy, pickAPlanTermBillingPlanModel) => ({
        paymentInfo,
        creditCardOnFileViewModel,
        legalCopy,
        pickAPlanTermBillingPlanModel,
    })
);

export const getUpdateOfferOnProvinceChange = createSelector(featureState, (state) => state.updateOfferOnProvinceChange);

const getTargetedPaymentFormMode = createSelector(getAccountFirstSubscriptionFirstPlanIsRtdTrial, getPaymentFormType, (isRtdTrial, paymentFormType) => {
    if (isRtdTrial) {
        return `ADRESS_INFO_REQUIRED_${paymentFormType}`;
    }
    return 'ADDRESS_INFO_NON_REQUIRED';
});

export const getTargetedPaymentViewModel = createSelector(
    getPaymentInfo,
    getLongDescriptionPlanRecapCardViewModel,
    getPaymentPostTrialViewModel,
    getCreditCardOnFileViewModel,
    getCurrentUserViewModel,
    getTargetedPaymentFormMode,
    (paymentInfo, longDescriptionPlanRecapCardViewModel, paymentPostTrialViewModel, creditCardOnFileViewModel, currentUserViewModel, paymentFormMode) => ({
        paymentInfo,
        longDescriptionPlanRecapCardViewModel,
        paymentPostTrialViewModel,
        creditCardOnFileViewModel,
        currentUserViewModel,
        paymentFormMode,
    })
);
