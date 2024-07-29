import { createSelector } from '@ngrx/store';
import {
    getCampaignIdFromQueryParams,
    getCardOnFile,
    getPaymentInfo,
    getPaymentInfoCardNumberLastFourAndCardType,
    getPaymentInfoServiceAddress,
    getSelectedOfferDealCopy,
    getSelectedOfferOfferInfoHero,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedPlanCode,
    getSelectedProvinceCode,
    getUseCardOnFile,
    selectInboundQueryParams,
    getPlanRecapCardViewModel,
    getLongDescriptionPlanRecapCardViewModel,
    getIsRefreshAllowed,
} from '@de-care/de-care-use-cases/checkout/state-common';
import { getAllOfferPackageNameKeysMappedByPlanCode, getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import { selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import {
    getAccountIsTrial,
    getAccountSubscriptionFirstPlanTermLength,
    getAccountSubscriptionHasActiveNonTrialSubscription,
    getAccountSubscriptonFirstPlanEndDate,
    getAccountVehicleInfo,
    getDeviceInfo,
    getProgramCodeFromQueryParams,
    getRegistrationViewModel,
    getSelectedChangedOffer,
    getSelectedOfferPriceAndTermInfo,
    getSelectedRadioId,
    getSelectedRadioIdLastFour,
} from './selectors';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
import {
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    getClosedDeviceSubscription,
    getFirstAccountSubscription,
    selectAccount,
} from '@de-care/domains/account/state-account';
import { getCampaignsHeroContentMappedByCampaignId } from '@de-care/domains/cms/state-campaigns';
import { getAllUpsellOffersAsArray } from '@de-care/domains/offers/state-upsells';
import { getFlepzLookupSubscriptions, numberOfSubscriptionsFound, singleAccountResultSubscriptionIsActive } from '@de-care/domains/identity/state-flepz-lookup';

export { getFlepzLookupSubscriptions, numberOfSubscriptionsFound, singleAccountResultSubscriptionIsActive } from '@de-care/domains/identity/state-flepz-lookup';
export { getShouldIncludeNuCaptcha as getDisplayNuCaptcha, getQuebecProvince } from '@de-care/de-care-use-cases/checkout/state-common';
export { getIsClosedRadio } from '@de-care/domains/account/state-account';

export const flepzResultsForDisplay = createSelector(
    getFlepzLookupSubscriptions,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (subscriptions, allPackageDescriptions) => {
        return subscriptions?.map((subscription) => {
            const planNames = subscription?.plans?.map((plan) => {
                const name = allPackageDescriptions[plan.packageName]?.name || null;
                return name;
            });
            return {
                vehicleInfo:
                    subscription?.radioService?.vehicleInfo?.year || subscription?.radioService?.vehicleInfo?.make || subscription?.radioService?.vehicleInfo?.model
                        ? subscription?.radioService?.vehicleInfo
                        : null,
                last4DigitsOfRadioId: subscription.radioService.last4DigitsOfRadioId,
                planNames,
                isClosed: subscription.status === 'Closed',
            };
        });
    }
);

export const flepzResultsVM = createSelector(flepzResultsForDisplay, numberOfSubscriptionsFound, (flepzResultsForDisplay, numberOfSubscriptionsFound) => ({
    flepzResultsForDisplay,
    numberOfSubscriptionsFound,
}));

export const searchResultsDisplayInfo = createSelector(
    numberOfSubscriptionsFound,
    singleAccountResultSubscriptionIsActive,
    (numberOfSubscriptionsFound, singleAccountResultSubscriptionIsActive) => {
        return {
            showMultipleDevicesFound: numberOfSubscriptionsFound > 1,
            showActiveSubscriptionFound: numberOfSubscriptionsFound === 1 && singleAccountResultSubscriptionIsActive,
            showDeviceFound: numberOfSubscriptionsFound === 1,
        };
    }
);
export { selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId } from '@de-care/domains/offers/state-package-descriptions';
export const getUserEnteredDataForTargetedPaymentInfo = createSelector(getPaymentInfo, getUseCardOnFile, (paymentInfo, useCardOnFile) =>
    paymentInfo || useCardOnFile
        ? {
              serviceAddress: paymentInfo?.serviceAddress,
              creditCard: {
                  nameOnCard: paymentInfo?.nameOnCard,
                  cardNumber: paymentInfo?.cardNumber,
                  expirationDate: paymentInfo?.cardExpirationDate,
              },
              useCardOnFile,
          }
        : null
);

export const targetedTransactionStateExists = createSelector(getPaymentInfo, getUseCardOnFile, (getPaymentInfo, useCardOnFile) => useCardOnFile || !!getPaymentInfo);

export const getDeviceLookupViewModel = createSelector(getProgramCodeFromQueryParams, selectInboundQueryParams, (programCode, queryParams) => ({
    programCode,
    showHeadingText: queryParams?.tbview?.toLowerCase() === 'dm',
}));

export const getActiveSubscriptionStateDataAvailable = createSelector(getAccountSubscriptionHasActiveNonTrialSubscription, (hasActiveSubscription) => hasActiveSubscription);

export const getSelectedOfferViewModel = createSelector(
    getSelectedOfferOfferInfoHero,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedChangedOffer,
    (hero, offerDescription, legalCopy, offerData) => ({
        hero,
        offerDescription,
        legalCopy,
        termLength: offerData?.termLength,
        retailPrice: offerData?.retailPrice,
        totalPrice: offerData?.price,
    })
);
export const getTargetedSelectedOfferViewModel = createSelector(getSelectedOfferViewModel, (viewModel) => viewModel);

export const getUpsellOffersViewModel = createSelector(getAllUpsellOffersAsArray, (upsellOffers) => upsellOffers);

export const getSelectedOfferForPresentmentViewModel = createSelector(
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferDealCopy,
    (offerDescription, legalCopy, offerDealCopy) => ({
        offerDescription,
        legalCopy,
        offerDealCopy: offerDealCopy?.[0],
    })
);

export const getOrganicOfferPresentmentPageViewModel = createSelector(getSelectedOfferForPresentmentViewModel, (selectedOfferData) => ({
    ...selectedOfferData,
}));

export const getOrganicDeviceLookupPageViewModel = createSelector(getSelectedOfferForPresentmentViewModel, getPlanRecapCardViewModel, (selectedOfferData, planRecapCard) => ({
    legalCopy: selectedOfferData.legalCopy,
    planRecapCard,
    showFlepzLookup: true,
    showDeviceLookup: true,
    showRadioLookupWithAccountNumber: true,
    showRadioLookupWithLastName: false,
    // TODO: Add any prefill data if needed
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

export const getAccountInfoViewModel = createSelector(
    selectAccount,
    getAccountVehicleInfo,
    getSelectedRadioIdLastFour,
    getAccountSubscriptonFirstPlanEndDate,
    getAccountIsTrial,
    getAccountSubscriptionFirstPlanTermLength,
    (selectedAccount, vehicleInfo, radioIdLastFour, currentPlanEndDate, accountIsTrial, termLength) =>
        selectedAccount && {
            vehicleInfo,
            radioIdLastFour,
            currentPlanEndDate,
            accountIsTrial,
            termLength,
        }
);

export const getChangeSelectedOfferIsAllowed = createSelector(getAllOffersAsArray, (offers) => offers.length > 1);

const getAccountClosedDeviceForRadioId = createSelector(
    getSelectedRadioId,
    getClosedDevicesFromAccount,
    (selectedRadioId, closedDevices) => selectedRadioId && closedDevices?.find((closedDevice) => selectedRadioId.endsWith(closedDevice.last4DigitsOfRadioId))
);

const getAccountSubscriptionForRadioId = createSelector(
    getSelectedRadioId,
    getAccountSubscriptions,
    (selectedRadioId, subscriptions) => selectedRadioId && subscriptions?.find((subscription) => selectedRadioId.endsWith(subscription?.radioService?.last4DigitsOfRadioId))
);

const getAccountSubscriptionPackageNameForRadioIdIfTrial = createSelector(
    getAccountSubscriptionForRadioId,
    (subscription) => subscription?.plans?.[0]?.type?.toLowerCase() === 'trial' && subscription?.plans?.[0]?.packageName
);

const getAccountClosedSubscriptionIfTrial = createSelector(
    getClosedDevicesFromAccount,
    (closedDevices) => closedDevices?.find((closedDevice) => closedDevice.subscription?.plans[0]?.type === 'TRIAL')?.subscription?.plans[0].packageName
);

const getPackageNameIfTrial = createSelector(
    getAccountSubscriptionPackageNameForRadioIdIfTrial,
    getAccountClosedSubscriptionIfTrial,
    (subscriptionTrialPackageName, closedDeviceSubscriptionTrialPackageName) => subscriptionTrialPackageName || closedDeviceSubscriptionTrialPackageName
);

export const getOfferPricingInfoForChangeSelectedMappedByPlanCode = createSelector(getAllOffersAsArray, getPackageNameIfTrial, (offers, packageNameIfTrial) =>
    offers.reduce((set, { planCode, packageName, price, termLength, retailPrice }) => {
        set[planCode] = {
            price,
            termLength,
            retailPrice,
            isInTrial: packageName === packageNameIfTrial,
        };
        return set;
    }, {})
);
export const getChangeSelectedOfferViewModel = createSelector(
    getSelectedPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    getAllOfferPackageNameKeysMappedByPlanCode,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (selectedPlanCode, offerInfos, packageNameKeys, allPackageDescriptions) => {
        return Object.keys(offerInfos).map((planCode) => {
            const packageName = packageNameKeys[planCode];
            const packageDescriptions = allPackageDescriptions?.[packageName];
            return {
                selected: planCode === selectedPlanCode,
                name: packageDescriptions?.name,
                planCode,
                packageName,
                priceText: '',
                calloutText: '',
                channelCountText: packageDescriptions?.channels?.[0]?.features?.find((feature) => feature.name.toLowerCase() === 'channels included')?.count,
                features: packageDescriptions?.channels?.[0]?.features?.filter((feature) => feature.name.toLowerCase() !== 'channels included'),
                channelLineupLink: { text: '', url: packageDescriptions?.channelLineUpURL },
            };
        });
    }
);

export const getPaymentMethodOptionsViewModel = createSelector(getCardOnFile, (cardOnFile) => ({
    useCardOnFileAllowed: cardOnFile?.status?.toUpperCase() === 'ACTIVE',
    ...(cardOnFile?.type ? { cardType: cardOnFile?.type } : {}),
    ...(cardOnFile?.last4Digits ? { cardNumberLastFour: cardOnFile?.last4Digits } : {}),
}));

export const getSelectedPaymentMethodSummaryViewModel = createSelector(getPaymentInfoCardNumberLastFourAndCardType, (cardNumberAndType) => ({
    ...cardNumberAndType,
    cardType: cardNumberAndType?.cardType?.toUpperCase(),
}));

export const getCollectedServiceAddressForFormFields = createSelector(getPaymentInfoServiceAddress, (serviceAddress) => {
    if (!serviceAddress) {
        return null;
    }
    const { country, avsValidated, ...address } = serviceAddress;
    return address;
});

export const getQuoteViewModel = createSelector(getQuote, (quote) => quote || null);

export const getConfirmationPageViewModel = createSelector(
    getSelectedRadioIdLastFour,
    getQuoteViewModel,
    getRegistrationViewModel,
    getIsRefreshAllowed,
    (radioIdLastFour, quoteViewModel, registrationViewModel, isRefreshAllowed) => ({
        radioIdLastFour,
        quoteViewModel,
        registrationViewModel,
        isRefreshAllowed,
    })
);

export const getRadioInfoForSelectedDeviceViewModel = createSelector(
    getAccountSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    getAccountClosedDeviceForRadioId,
    (subscription, allPackageDescriptions, closedDevice) =>
        closedDevice ? [{ isClosed: true, closedDate: closedDevice.closedDate }] : mapSubscriptionPlansToSummary(subscription, allPackageDescriptions)
);

export const getRadioInfoForActiveSubscriptionViewModel = createSelector(
    getSelectedRadioIdLastFour,
    getAccountSubscriptionForRadioId,
    selectPackageDescriptionsForCurrentLocaleMappedByPackageNameId,
    (radioIdLastFour, subscription, allPackageDescriptions) => ({
        radioIdLastFour,
        plans: mapSubscriptionPlansToSummary(subscription, allPackageDescriptions),
    })
);

function mapSubscriptionPlansToSummary(
    subscription,
    allPackageDescriptions
): {
    name: string;
    startDate: string;
    endDate: string;
    nextCycleOn: string;
    isTrial: boolean;
    isPromo: boolean;
}[] {
    return [
        ...(subscription?.plans?.map((plan) => ({
            name: allPackageDescriptions[plan.packageName]?.name,
            endDate: plan.endDate,
            nextCycleOn: plan.nextCycleOn,
            isTrial: plan.type.toLowerCase() === 'trial',
            isPromo: plan.type.toLowerCase() === 'promo',
        })) || []),
        ...(subscription?.followonPlans?.map((plan) => ({
            name: allPackageDescriptions[plan.packageName]?.name,
            startDate: plan.startDate,
            endDate: plan.endDate,
            nextCycleOn: plan.nextCycleOn,
            isTrial: plan.type.toLowerCase() === 'trial',
            isPromo: plan.type.toLowerCase() === 'promo',
        })) || []),
    ];
}

export const getVehicleInfoVM = createSelector(getFirstAccountSubscription, getClosedDeviceSubscription, (firstAccountSubscription, closedDeviceSubscription) => {
    const subscriptionObj = firstAccountSubscription ? firstAccountSubscription : closedDeviceSubscription?.subscription;
    const radioServiceObj = firstAccountSubscription ? firstAccountSubscription.radioService : closedDeviceSubscription;
    //TODO: Consider moving this logic to a helper function for re-use
    const nickname = subscriptionObj?.nickname;
    const vehicleInfo = radioServiceObj?.vehicleInfo;
    const hasDuplicateVehicleInfo = subscriptionObj?.hasDuplicateVehicleInfo;

    let last4OfRadioId: string;
    let yearMakeModel;

    if (!nickname) {
        yearMakeModel = vehicleInfo?.year || vehicleInfo?.make || vehicleInfo?.model ? vehicleInfo : null;
        if (!yearMakeModel || hasDuplicateVehicleInfo) {
            last4OfRadioId = radioServiceObj?.last4DigitsOfRadioId;
        }
    }

    const vehicleInfoVM = {
        ...(nickname && { nickname }),
        ...(yearMakeModel && { yearMakeModel }),
        ...(last4OfRadioId && { last4OfRadioId }),
    };

    return vehicleInfoVM;
});

export const getVehicleInfoFromDeviceVM = createSelector(getDeviceInfo, (deviceInfo) => {
    const nickname = deviceInfo?.nickname;
    const vehicleInfo = deviceInfo?.vehicleInfo;
    const hasDuplicateVehicleInfo = deviceInfo?.hasDuplicateVehicleInfo;

    let last4OfRadioId: string;
    let yearMakeModel;

    if (!nickname) {
        yearMakeModel = vehicleInfo?.year || vehicleInfo?.make || vehicleInfo?.model ? vehicleInfo : null;
        if (!yearMakeModel || hasDuplicateVehicleInfo) {
            last4OfRadioId = deviceInfo?.last4DigitsOfRadioId;
        }
    }

    const vehicleInfoVM = {
        ...(nickname && { nickname }),
        ...(yearMakeModel && { yearMakeModel }),
        ...(last4OfRadioId && { last4OfRadioId }),
        hasVehicleData: nickname || yearMakeModel || last4OfRadioId,
    };

    return vehicleInfoVM;
});

export { getPlanRecapCardViewModel, getLongDescriptionPlanRecapCardViewModel };

export const getPaymentInterstitialPageViewModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getVehicleInfoVM,
    getVehicleInfoFromDeviceVM,
    (legalCopy, vehicleInfo, vehicleInfoFromDeviceInfo) => ({
        legalCopy,
        vehicleInfo: vehicleInfoFromDeviceInfo.hasVehicleData ? vehicleInfoFromDeviceInfo : vehicleInfo,
    })
);

export const getPaymentMethodStepPageViewModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getLongDescriptionPlanRecapCardViewModel,
    getPaymentMethodOptionsViewModel,
    getUserEnteredDataForTargetedPaymentInfo,
    getVehicleInfoVM,
    getVehicleInfoFromDeviceVM,
    (legalCopy, planRecapCard, paymentMethodOptions, paymentInfo, vehicleInfo, vehicleInfoFromDeviceInfo) => ({
        legalCopy,
        planRecapCard,
        paymentMethodOptions,
        paymentInfo,
        vehicleInfo: vehicleInfoFromDeviceInfo.hasVehicleData ? vehicleInfoFromDeviceInfo : vehicleInfo,
    })
);
