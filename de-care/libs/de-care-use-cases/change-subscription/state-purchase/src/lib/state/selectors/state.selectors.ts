import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';
import { getAllDataCapableOffersAsArray, getAllNonDataCapableOffers, getAllNonDataCapableOffersUniqueByTerm } from '@de-care/domains/offers/state-offers';
import { getPersonalInfoSummary, getAccountSubscriptions, accountPlanTypeIsTrial, getIsCanada, getIsQuebec } from '@de-care/domains/account/state-account';

export const getPlanCode = createSelector(selectFeature, (state) => state.planCode);
export const getInfotainmentPlanCodes = createSelector(selectFeature, (state) => state.infotainmentPlanCodes);

export const getSelectedInfotainmentOffers = createSelector(getInfotainmentPlanCodes, getAllDataCapableOffersAsArray, (planCodes, offers) => {
    const packageNames = offers.filter((offer) => planCodes.indexOf(offer.planCode) > -1).map((offer) => offer.packageName);
    return offers.filter((offer) => packageNames.indexOf(offer.packageName) > -1);
});
export const getInfotainmentOffersPackageNames = createSelector(getSelectedInfotainmentOffers, (offers) => [...new Set(offers.map((offer) => offer.packageName))]);
export const getTermType = createSelector(selectFeature, (state) => state.termType);
export const getSelectedInfotainmentPlansAccordingTerm = createSelector(getSelectedInfotainmentOffers, getTermType, (offers, term) => {
    const termLength = term === 'annual' ? 12 : 1;
    return offers.filter((offer) => offer.termLength === termLength);
});
export const getSelectedInfotainmentPlanCodesAccordingTerm = createSelector(getSelectedInfotainmentPlansAccordingTerm, (offers) => offers.map((offer) => offer.planCode));

export const getHasAudioOffers = createSelector(getAllNonDataCapableOffersUniqueByTerm, (offers) => offers.length > 0);

export const getAudioPackageChangeAllowed = createSelector(selectFeature, getHasAudioOffers, (state, hasAudioOffers) => !state.changeTermOnlyMode && hasAudioOffers);
export const getCurrentSubscriptionId = createSelector(selectFeature, (state) => state?.subscriptionId);
export const getIsTokenMode = createSelector(selectFeature, (state) => state?.isTokenMode);

export const getCurrentSubscription = createSelector(getAccountSubscriptions, getCurrentSubscriptionId, (accountSubscriptions, subscriptionId) => {
    const subscriptionIdString = subscriptionId && subscriptionId.toString();
    return accountSubscriptions && subscriptionIdString ? accountSubscriptions.find((subscription) => subscription.id === subscriptionIdString) : null;
});
export const getCurrentSubscriptionIsDataOnly = createSelector(getCurrentSubscription, (subscription) => subscription?.isDataOnly);

export const getStreamingService = createSelector(getCurrentSubscription, (currentSubscription) => currentSubscription.streamingService || null);
export const getMaskedUserName = createSelector(getStreamingService, (streamingService) => streamingService?.maskedUserName || null);
export const getCurrentSubscriptionPlans = createSelector(getCurrentSubscription, (subscription) => subscription?.plans);
export const getCurrentSubscriptionPlanCodes = createSelector(getCurrentSubscriptionPlans, (plans) => plans && plans.map((plan) => plan.code));
export const getCurrentSubscriptionPackageNames = createSelector(getCurrentSubscriptionPlans, (plans) => plans && plans.map((plan) => plan.packageName));
export const getCurrentSubscriptionFollowonPlans = createSelector(getCurrentSubscription, (currentPlan) => currentPlan?.followonPlans || []);
export const getCurrentSubscriptionFollowonPlanCodes = createSelector(getCurrentSubscriptionFollowonPlans, (plans) => plans && plans.map((plan) => plan.code));
export const getCurrentSubscriptionFirstPlan = createSelector(getCurrentSubscriptionPlans, (plans) => plans && plans[0]);
export const getCurrentSubscriptionFirstPlanPackageName = createSelector(getCurrentSubscriptionFirstPlan, (plan) => plan?.packageName);
export const getCurrentSubscriptionFirstFollowonPlan = createSelector(getCurrentSubscriptionFollowonPlans, (followonPlans) => followonPlans && followonPlans[0]);
export const getCurrentSubscriptionRadioService = createSelector(getCurrentSubscription, (subscription) => subscription?.radioService || null);
export const getCurrentPlanTermLength = createSelector(getCurrentSubscriptionFirstPlan, (plan) => plan?.termLength);
export const getCurrentPlanIsTrial = createSelector(getCurrentSubscriptionFirstPlan, (plan) => accountPlanTypeIsTrial(plan?.type));
export const getCurrentPlanIsTrialAndCurrentSubscriptionHasFollowOns = createSelector(
    getCurrentPlanIsTrial,
    getCurrentSubscriptionFirstFollowonPlan,
    (accountIsTrial, subscriptionFirstFollowOn) => accountIsTrial && !!subscriptionFirstFollowOn
);

export const getCurrentRadioServiceIsDataCapable = createSelector(
    getCurrentSubscriptionRadioService,
    (radioService) => radioService?.capabilities?.some((value) => value === 'TRF' || value === 'TRV') || false
);
export const getCurrentSubscriptionIsStreamingOnly = createSelector(
    getCurrentSubscription,
    (currentSubscription) => currentSubscription && currentSubscription.streamingService && !currentSubscription.radioService
);

function mapPlanSummary(plan, isCanada, isQuebec) {
    return {
        planCode: plan && plan.code,
        packageName: plan && plan.packageName,
        type: plan && plan.type,
        termLength: plan && plan.termLength,
        price: plan && plan.price,
        endDate: plan && plan.endDate,
        marketType: plan && plan.marketType,
        isCanada,
        isTrial: accountPlanTypeIsTrial(plan?.type),
        isQuebec,
        isBasePlan: plan && plan.isBasePlan,
        dataCapable: plan && plan.dataCapable,
        isPreTiering: plan && plan.isPreTiering,
    };
}

export const getCurrentPlanSummary = createSelector(getCurrentSubscriptionFirstPlan, getIsCanada, getIsQuebec, (plan, isCanada, isQuebec) =>
    mapPlanSummary(plan, isCanada, isQuebec)
);
export const getAllCurrentPlanSummaries = createSelector(getCurrentSubscriptionPlans, getIsCanada, getIsQuebec, (allPlans, isCanada, isQuebec) => {
    return allPlans.map((plan) => mapPlanSummary(plan, isCanada, isQuebec));
});
export const getFollowonPlanSummary = createSelector(getCurrentSubscriptionFirstFollowonPlan, getIsCanada, getIsQuebec, (followOnPlan, isCanada, isQuebec) =>
    !!followOnPlan
        ? {
              ...mapPlanSummary(followOnPlan, isCanada, isQuebec),
              isFollowon: true,
          }
        : null
);
export const getAllFollowonPlanSummaries = createSelector(getCurrentSubscriptionFollowonPlans, getIsCanada, getIsQuebec, (allFollowOnPlans, isCanada, isQuebec) =>
    !!allFollowOnPlans
        ? allFollowOnPlans.map((followOnPlan) => {
              return {
                  ...mapPlanSummary(followOnPlan, isCanada, isQuebec),
                  isFollowon: true,
              };
          })
        : []
);

export const getSelectedOfferObject = createSelector(getAllNonDataCapableOffers, getPlanCode, (offers, planCode) => {
    if (offers && planCode) {
        return offers.find((offer) => offer.planCode === planCode);
    }
    return null;
});

export const getOffersBasedOnCurrentPlan = createSelector(getCurrentSubscriptionFirstPlanPackageName, getAllNonDataCapableOffers, (packageName, offers) => {
    const offersByPackageName = packageName && offers && offers.filter((offer) => offer.packageName === packageName);
    return Array.isArray(offersByPackageName) ? offersByPackageName : [];
});

export const getOffersBasedOnSelectedPlanCode = createSelector(getSelectedOfferObject, getAllNonDataCapableOffers, (selectedOffer, offers) => {
    if (!!selectedOffer) {
        const offersByPackageName = offers.filter((offer) => offer.packageName === selectedOffer.packageName);
        return Array.isArray(offersByPackageName) ? offersByPackageName : [];
    } else {
        return [];
    }
});

export const getSelectedTermLength = createSelector(getTermType, (termType) => {
    if (termType === 'annual') {
        return 12;
    } else if (termType === 'monthly') {
        return 1;
    } else {
        return null;
    }
});
export const getCurrentOfferBasedOnSelectedTerm = createSelector(
    getOffersBasedOnCurrentPlan,
    getSelectedTermLength,
    (offers, termLength) => offers && termLength && offers.find((offer) => offer.termLength === termLength)
);
export const getCurrentPlanCodeBasedOnSelectedTerm = createSelector(getCurrentOfferBasedOnSelectedTerm, (offer) => offer?.planCode);

export const getSelectedPlanCodeBasedOnSelectedTerm = createSelector(getOffersBasedOnSelectedPlanCode, getSelectedTermLength, getPlanCode, (offers, termLength, planCode) => {
    if (termLength > 0) {
        const offer = offers.find((o) => o.termLength === termLength);
        return offer ? offer.planCode : null;
    } else {
        return planCode;
    }
});

export const getSelectedOfferObjectBasedOnSelectedTerm = createSelector(
    getOffersBasedOnSelectedPlanCode,
    getSelectedTermLength,
    getPlanCode,
    (offers, termLength, planCode) => {
        if (offers && termLength && planCode) {
            if (termLength > 0) {
                const offer = offers.find((o) => o.termLength === termLength);
                return offer || null;
            } else {
                const offer = offers.find((o) => o.planCode === planCode);
                return offer;
            }
        }
        return null;
    }
);

export const getSelectedPlanCodeAndPrice = createSelector(getSelectedOfferObjectBasedOnSelectedTerm, (offer) => ({
    planCode: offer?.planCode,
    price: offer?.price,
}));

export const getSelectedOrCurrentPlanCodeAndPrice = createSelector(
    getCurrentOfferBasedOnSelectedTerm,
    getSelectedOfferObjectBasedOnSelectedTerm,
    (currentOffer, selectedOffer) => {
        if (selectedOffer) {
            return {
                planCode: selectedOffer.planCode,
                price: selectedOffer.price,
            };
        } else if (currentOffer) {
            return {
                planCode: currentOffer.planCode,
                price: currentOffer.price,
            };
        }
        return {
            planCode: null,
            price: null,
        };
    }
);

export const getSelectedDataCapablePlanCodeAndPrice = createSelector(getSelectedInfotainmentPlansAccordingTerm, (offers) =>
    offers.map(({ planCode, price }) => ({ planCode, price }))
);

export const getPlanCodesForSubmission = createSelector(
    getCurrentPlanCodeBasedOnSelectedTerm,
    getSelectedPlanCodeBasedOnSelectedTerm,
    getSelectedInfotainmentPlanCodesAccordingTerm,
    (currentPlanCode, selectedPlanCode, selectedInfotainmentPlancodes) => ({
        audioPlans: selectedPlanCode ? [selectedPlanCode] : currentPlanCode ? [currentPlanCode] : [],
        infotainmentPlans: selectedInfotainmentPlancodes,
    })
);
export const getShouldUseCardOnFile = createSelector(selectFeature, (state) => state.useCardOnFile);
export const getPaymentInfo = createSelector(selectFeature, (state) => state.paymentInfo);
export const getTransactionId = createSelector(selectFeature, (state) => state.transactionId);

export const getPaymentInfoAndTransactionId = createSelector(getPaymentInfo, getTransactionId, (paymentInfo, transactionId) => ({
    paymentInfo: paymentInfo,
    transactionId: transactionId,
}));

export const getChangeSubscriptionSubmitData = createSelector(
    getPaymentInfoAndTransactionId,
    getCurrentSubscription,
    getPlanCodesForSubmission,
    getPersonalInfoSummary,
    getShouldUseCardOnFile,
    getFollowonPlanSummary,
    getCurrentPlanIsTrial,
    getCurrentSubscriptionIsDataOnly,
    (paymentInfoAndTransactionId, { id }, planCodesForSubmission, account, shouldUseCardOnFile, followonPlanSummary, currentPlanIsTrial, currentSubscriptionIsDataOnly) => {
        const address = {
            phone: account?.phone,
            avsvalidated: false,
            streetAddress: paymentInfoAndTransactionId?.paymentInfo?.billingAddress?.addressLine1,
            city: paymentInfoAndTransactionId?.paymentInfo?.billingAddress?.city,
            state: paymentInfoAndTransactionId?.paymentInfo?.billingAddress?.state,
            postalCode: paymentInfoAndTransactionId?.paymentInfo?.billingAddress?.zip,
            country: paymentInfoAndTransactionId?.paymentInfo.country,
            firstName: account?.firstName,
            lastName: account?.lastName,
            email: account?.email,
        };

        let planFlag: Record<string, any>;

        if (currentSubscriptionIsDataOnly && currentPlanIsTrial) {
            const infotainmentPlans = planCodesForSubmission.infotainmentPlans;
            const audioPlans = planCodesForSubmission.audioPlans;
            const hasInfotainmentPlans = infotainmentPlans.length > 0;
            const hasAudioPlans = audioPlans.length > 0;
            planFlag = {
                ...(hasInfotainmentPlans && {
                    followOnPlans: infotainmentPlans.map((planCode) => ({
                        planCode: planCode,
                    })),
                }),
                ...(hasAudioPlans && {
                    plans: planCodesForSubmission.audioPlans.map((planCode) => ({
                        planCode: planCode,
                    })),
                }),
            };
        } else {
            const planCodesAsObjects = planCodesForSubmission.audioPlans.concat(planCodesForSubmission.infotainmentPlans).map((planCode) => ({
                planCode: planCode,
            }));
            planFlag = currentPlanIsTrial ? { followOnPlans: planCodesAsObjects } : { plans: planCodesAsObjects };
        }

        return shouldUseCardOnFile
            ? {
                  subscriptionId: parseInt(id, 10),
                  ...planFlag,
                  paymentInfo: {
                      useCardOnfile: shouldUseCardOnFile,
                      transactionId: paymentInfoAndTransactionId?.transactionId,
                  },
              }
            : {
                  subscriptionId: parseInt(id, 10),
                  ...planFlag,
                  paymentInfo: {
                      useCardOnfile: false,
                      transactionId: paymentInfoAndTransactionId?.transactionId,
                      paymentType: 'creditCard',
                      cardInfo: {
                          cardNumber: parseInt(paymentInfoAndTransactionId?.paymentInfo?.ccNum, 10),
                          expiryMonth: paymentInfoAndTransactionId?.paymentInfo?.ccExpDate?.split('/')[0],
                          expiryYear: parseInt(paymentInfoAndTransactionId?.paymentInfo?.ccExpDate?.split('/')[1], 10),
                          nameOnCard: paymentInfoAndTransactionId?.paymentInfo?.ccName,
                      },
                  },
                  billingAddress: address,
                  serviceAddress: address,
              };
    }
);

export const getReviewOrderDataLoadIsProcessing = createSelector(selectFeature, (state) => state.loadReviewOrderDataIsProcessing);

export const getSubmitChangeSubscriptionDataIsProcessing = createSelector(selectFeature, (state) => state.submitChangeSubscriptionDataIsProcessing);
export const getPackageSelectionIsDowngrade = createSelector(selectFeature, (state) => state.packageSelectionIsDowngrade);
export { getIsCanadaMode } from '@de-care/shared/state-settings';

export const getSelectedSubscriptionIDForSAL = createSelector(selectFeature, (state) => state?.selectedSubscriptionIDForSAL);
export const getIsRefreshAllowed = createSelector(selectFeature, (state) => state.isRefreshAllowed);
