import {
    getLongDescriptionPlanRecapCardViewModel,
    getQuebecProvince,
    getSelectedOffer,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferPriceAndTermInfo,
    getSelectedProvinceCode,
    getShouldIncludeNuCaptcha,
    getUserEnteredCredentials,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getAccountFirstSubscriptionStreamingServiceMaskedUsername, getAccountSubscriptions } from '@de-care/domains/account/state-account';
import { getFirstOfferIsFallback, getRenewalOffersFirstOffer } from '@de-care/domains/offers/state-offers';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { createSelector } from '@ngrx/store';
import {
    featureState,
    getCountryCode,
    getIsFullAddressForm,
    getIsQuebecProvince,
    getShoulPresentRenewalFromQueryParams,
    getProgramCode,
    getSelectedOfferOfferInfoDetails,
} from './selectors';
export const getOrganicOfferPresentmentViewModel = createSelector(
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    (offerDescription, legalCopy) => ({
        offerDescription,
        legalCopy,
    })
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

export const getUserEnteredDataForOrganicCredentials = createSelector(getUserEnteredCredentials, (credentials) => ({
    email: credentials?.email,
    password: credentials?.password,
}));

const getOfferIncludesFees = createSelector(getSelectedOfferPriceAndTermInfo, getSelectedProvinceCode, (offer, selectedProvinceCode) => {
    if (offer?.price === 0 && offer?.retailPricePerMonth === 0) {
        return false;
    } else if (selectedProvinceCode?.length > 0 && selectedProvinceCode?.toLowerCase() !== 'qc' && offer?.retailPricePerMonth !== 0) {
        return true;
    } else {
        return false;
    }
});

const getPlanRecapCardViewModel = createSelector(getSelectedOfferOfferInfoOfferDescription, (offerDescription) => {
    return offerDescription?.recapDescription
        ? {
              description: offerDescription?.recapDescription,
          }
        : null;
});

export const getOrganicCredentialsViewModel = createSelector(
    getActiveStreamingSubscriptionViewModel,
    getOfferIncludesFees,
    getPlanRecapCardViewModel,
    (activeStreamingSubscriptionViewModel, offerIncludesFees, planRecapCardViewModel) => ({
        activeStreamingSubscriptionViewModel,
        offerIncludesFees,
        planRecapCardViewModel,
    })
);

const getPaymentInterstitialBulletsViewModel = createSelector(getSelectedOfferOfferInfoDetails, (offerInfo) => offerInfo?.paymentInterstitialBullets || []);

export const getAccountInfoInterstitialViewModel = createSelector(getPaymentInterstitialBulletsViewModel, (paymentInterstitialBulletsViewModel) => ({
    bullets: paymentInterstitialBulletsViewModel,
}));

export const organicTransactionStateExists = createSelector(getUserEnteredCredentials, (userEnteredCredentials) => !!userEnteredCredentials?.email);

export const getSelectedOfferFallbackReasonInfo = createSelector(getSelectedOffer, getProgramCode, (offer, programcode) => ({
    isFallback: !!offer?.fallback,
    reason: offer?.fallbackReason,
    programcode,
}));

const getSelectedOfferInfo = createSelector(
    getLongDescriptionPlanRecapCardViewModel,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    (longDescriptionPlanRecapCardViewModel, leadOfferDescription, legalCopy) => ({
        leadOfferDescription,
        longDescriptionPlanRecapCardViewModel,
        legalCopy,
    })
);

export const organicpaymentSetupPageViewModel = createSelector(
    getLongDescriptionPlanRecapCardViewModel,
    getFirstOfferIsFallback,
    getSelectedOfferOfferInfoLegalCopy,
    (longDescriptionPlanRecapCardViewModel, firstOfferIsFallback, offerInfoLegalCopy) => ({
        longDescriptionPlanRecapCardViewModel,
        showAlternateOfferAlert: firstOfferIsFallback,
        offerInfoLegalCopy,
    })
);

export const getOrganicAccountInfoViewModel = createSelector(
    getIsFullAddressForm,
    getSelectedOfferInfo,
    getRenewalOffersFirstOffer,
    getIsQuebecProvince,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    getCountryCode,
    getShoulPresentRenewalFromQueryParams,
    (
        isFullAddressForm,
        { longDescriptionPlanRecapCardViewModel, leadOfferDescription, legalCopy },
        renewalOffer,
        isQuebecProvince,
        streamingServiceMaskedUsername,
        countryCode,
        shouldPresentRenewal
    ) => ({
        isFullAddressForm,
        longDescriptionPlanRecapCardViewModel,
        legalCopy,
        leadOfferPlanName: leadOfferDescription?.platformPlan,
        renewalPrice: renewalOffer?.price,
        renewalPlanCode: renewalOffer?.planCode,
        displayFeesAndTaxes: !isQuebecProvince,
        streamingServiceMaskedUsername,
        countryCode: countryCode,
        shouldPresentRenewal,
    })
);
export const organicFollowOnOptionViewModel = createSelector(
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    getRenewalOffersFirstOffer,
    getIsQuebecProvince,
    getAccountFirstSubscriptionStreamingServiceMaskedUsername,
    (leadOfferDescription, legalCopy, renewalOffer, isQuebecProvince, streamingServiceMaskedUsername) => ({
        legalCopy,
        leadOfferPlanName: leadOfferDescription?.platformPlan,
        renewalPrice: renewalOffer?.price,
        renewalPlanCode: renewalOffer?.planCode,
        displayFeesAndTaxes: !isQuebecProvince,
        streamingServiceMaskedUsername,
    })
);

export const getUpdateOfferOnProvinceChange = createSelector(featureState, (state) => state.updateOfferOnProvinceChange);

export const getOrganicReviewModel = createSelector(
    getPlanRecapCardViewModel,
    getSelectedOfferOfferInfoLegalCopy,
    getQuote,
    getQuebecProvince,
    getShouldIncludeNuCaptcha,
    (planRecapCardViewModel, legalCopy, quoteViewModel, isQuebecProvince, displayNuCaptcha) => ({
        planRecapCardViewModel,
        legalCopy,
        quoteViewModel,
        isQuebecProvince,
        displayNuCaptcha,
    })
);
