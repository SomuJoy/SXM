import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode, getDealDescriptionSplitHidden, getDealDescriptionSplitShown } from '@de-care/domains/offers/state-offers-info';
import { getSelectedOfferOrOffer, getSubscriptions, parentRadioInfo, PurchaseState, PurchaseStateConstant, checkoutSelector } from '@de-care/purchase-state';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getPaymentCardTypeFromNumber } from '@de-care/shared/validation';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    getOfferOrUpsellPackageIsFree,
    getOfferOrUpsellPackageIsAdvantage,
    getIsStreaming,
    getOfferOrUpsellIsUpgradePromo,
    getFirstOfferFromOfferState,
    getIsStudentOffer,
} from './checkout-triage.selectors';
import { hasActiveTrial as determineHasActiveTrial } from '@de-care/data-services';
import { featureKey, CheckoutTriageState } from './checkout-triage.reducers';
import { getStateErrorIsForExpiredOrInvalidOffer } from '@de-care/checkout-state';
export const getCheckoutTriageState = createFeatureSelector<CheckoutTriageState>(featureKey);

export const getPurchaseState = createFeatureSelector<PurchaseState>(PurchaseStateConstant.STORE.NAME);
export const getPurchaseData = createSelector(getPurchaseState, (state) => state.data || null);

export const getPurchaseDataAccount = createSelector(getPurchaseData, (data) => data.account || null);

export const getIsNewPurchaseAccount = createSelector(getPurchaseDataAccount, (account) => {
    if (account === null) {
        return null;
    }

    return account.isNewAccount || false;
});

export const getActiveTrial = createSelector(getPurchaseDataAccount, (account) => {
    if (account === null) {
        return null;
    }

    return determineHasActiveTrial(account);
});

export const getIsAddSubscription = createSelector(getPurchaseData, (data) => data.isAddSubscription);

export const getPurchaseAccountHasSubscription = createSelector(getPurchaseDataAccount, (account) => !!account && !!account.subscriptions && account.subscriptions.length > 0);
export const getFirstSubscriptionInPurchaseAccount = createSelector(getPurchaseDataAccount, getPurchaseAccountHasSubscription, (account, hasSubscriptions) =>
    hasSubscriptions ? account.subscriptions[0] : null
);

export const getPurchaseAccountHasClosedDevices = createSelector(
    getPurchaseDataAccount,
    (account) => !!account && !!account.closedDevices && account.closedDevices.length > 0
);

export const getIsOfferStreamingEligible = createSelector(getPurchaseData, (data) => data.isOfferStreamingEligible);

export const getPartialHeroTitleType = createSelector(
    getOfferOrUpsellPackageIsAdvantage,
    getIsStreaming,
    getOfferOrUpsellPackageIsFree,
    getActiveTrial,
    getIsNewPurchaseAccount,
    getPurchaseAccountHasSubscription,
    getPurchaseAccountHasClosedDevices,
    getOfferOrUpsellIsUpgradePromo,
    (isAdvantage, isStreaming, isFreeOffer, isActiveTrial, isNewAccount, hasSubscription, hasClosedDevices, isUpgradePromo) => {
        if (isAdvantage) {
            return HeroTitleTypeEnum.Advantage;
        }

        if (isUpgradePromo) {
            return HeroTitleTypeEnum.UpgradePromo;
        }

        if (!isStreaming && !isFreeOffer && ((!hasSubscription && hasClosedDevices) || isNewAccount)) {
            return HeroTitleTypeEnum.Get;
        }

        if (isStreaming) {
            return HeroTitleTypeEnum.Streaming;
        }

        if (isFreeOffer) {
            return HeroTitleTypeEnum.TrialExtension;
        }

        if (isActiveTrial) {
            return HeroTitleTypeEnum.Keep;
        }

        return HeroTitleTypeEnum.Get; // default
    }
);
// Aditional selector required to cover the options for tittle type because of the limitation of arguments to create one selector
export const getHeroTitleType = createSelector(getPartialHeroTitleType, getIsStudentOffer, (titleType, isStudent) => (isStudent ? HeroTitleTypeEnum.StudentPlan : titleType));

export const getOffers = createSelector(getPurchaseData, (purchaseData) => purchaseData.offer?.offers);

export const getFirstOffer = createSelector(getOffers, (offers) => {
    if (offers !== null && offers !== undefined && offers.length > 0) {
        return offers[0];
    }
    return null;
});

export const getFirstOfferPlanCode = createSelector(getFirstOffer, (offer) => offer?.planCode);

export const getPurchaseProgramCode = createSelector(getPurchaseData, (purchaseData) => purchaseData?.programCode);

const getPaymentInfo = createSelector(getPurchaseState, ({ paymentInfo }) => paymentInfo);

export const getSelectedPaymentCardInfoSummary = createSelector(getPaymentInfo, ({ cardNumber }) => {
    const cardType = getPaymentCardTypeFromNumber(cardNumber);
    if (!!cardType && !!cardNumber) {
        return {
            cardType,
            cardNumberLast4Digits: cardNumber.substr(-4),
        };
    } else {
        return null;
    }
});

const getSelectedOfferOrOfferPlanCode = createSelector(getSelectedOfferOrOffer, (offer) => offer?.offers[0]?.planCode || '');
const getSelectedOfferOfferInfo = createSelector(
    getSelectedOfferOrOfferPlanCode,
    selectOfferInfosForCurrentLocaleMappedByPlanCode,
    (planCode, offerInfos) => offerInfos[planCode] || null
);
const getSelectedOfferOfferInfoSalesHero = createSelector(getSelectedOfferOfferInfo, (offerInfo) => offerInfo?.salesHero);
export const getSalesHeroCopyVM = createSelector(getSelectedOfferOfferInfoSalesHero, getStateErrorIsForExpiredOrInvalidOffer, (salesHero, stateErrorIsForExpiredOffer) => {
    if (stateErrorIsForExpiredOffer) {
        return {
            title: 'DEFAULT_TITLE',
        };
    }
    if (salesHero) {
        return {
            title: salesHero.title,
            subtitle: salesHero.subTitle, // Note: subTitle (capital T) from the MS response is being converted to subtitle (lowercase t) how it's named in Angular
            // TODO: figure out if we need to adjust the path for any reason (relative, etc)
            //       and if so we might want to do that at the offers info lib level
            presentation: salesHero.presentation,
            // TODO: get themes and turn these into classes that can be applied to the hero component
            //       not sure how this will work, but setting this as larger-padding for now
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});

export const getOfferDescriptionCopyVM = createSelector(getSelectedOfferOfferInfo, (offerInfo) => {
    if (offerInfo?.offerDescription) {
        const { offerDescription, packageDescription, presentation } = offerInfo;
        return {
            platformPlan: packageDescription.packageName,
            priceAndTermDescTitle: offerDescription.priceAndTermDescTitle,
            processingFeeDisclaimer: offerDescription.processingFeeDisclaimer,
            icons: packageDescription.icons,
            detailsTitle: packageDescription.highlightsTitle,
            details: packageDescription.highlightsText,
            footer: packageDescription.footer,
            promoFooter: packageDescription.promoFooter,
            toggleCollapsed: packageDescription.packageShowToggleText,
            toggleExpanded: packageDescription.packageHideToggleText,
            theme: presentation?.theme,
            presentation: presentation?.style,
        };
    }
});

export const getDealAddonCopyVM = createSelector(getSelectedOfferOfferInfo, (offerInfo) => {
    if (offerInfo?.deals && Array.isArray(offerInfo.deals) && offerInfo.deals.length > 0) {
        const { deals } = offerInfo;
        const dealsMapped = deals.map((deal) => ({
            marketingCallout: offerInfo.addonHeaderOverride || deal.header,
            title: deal.title,
            partnerImage: deal.deviceImage,
            productImage: deal.productImage,
            description: getDealDescriptionSplitHidden(deal.description),
            shownDescription: getDealDescriptionSplitShown(deal.description),
            // TODO: remove this description split if CMS changes this to be two properties instead
            toggleCollapsed: deal.addonShowToggleText,
            toggleExpanded: deal.addonHideToggleText,
            presentation: deal?.presentation,
        }));
        //TODO: This is to solve for Apple requirements while we work out how to get this info returned from CMS for each offer
        const displayDealsSeparately = offerInfo?.deals?.length > 1 && offerInfo?.deals?.some((deal) => deal?.name.toUpperCase() === 'APPLE');
        return { deals: dealsMapped, displayDealsSeparately: displayDealsSeparately };
    }
});

export const getLeadOfferPlanCode = createSelector(getFirstOfferFromOfferState, (offer) => offer?.planCode);
const getCheckoutRadioInfo = createSelector(checkoutSelector, parentRadioInfo);
const getActiveSubscriptionRadioId = createSelector(getCheckoutRadioInfo, (radio) => radio?.radioId);
const getActiveSubscriptionId = createSelector(getSubscriptions, (subscriptions) =>
    Array.isArray(subscriptions) && subscriptions.length > 0 ? subscriptions[0].subscriptionId : null
);

export const getDataForQuotesLoad = createSelector(
    getSelectedOfferOrOfferPlanCode,
    getActiveSubscriptionRadioId,
    getActiveSubscriptionId,
    (planCode, radioId, subscriptionId) => ({
        planCodes: [planCode],
        ...(radioId && { radioId }),
        ...(subscriptionId && { subscriptionId }),
    })
);

const getLegalCopyForAllPlanCodes = createSelector(selectOfferInfosForCurrentLocaleMappedByPlanCode, (offerInfos) =>
    !!offerInfos ? Object.keys(offerInfos).reduce((set, planCode) => ({ ...set, [planCode]: offerInfos[planCode]?.offerDetails }), {}) : {}
);
export const getLegalCopyData = createSelector(
    getLeadOfferPlanCode,
    getSelectedOfferOrOfferPlanCode,
    getLegalCopyForAllPlanCodes,
    (leadOfferPlanCode, selectedPlanCode, legalCopies) => ({
        leadOfferPlanCode,
        selectedPlanCode,
        legalCopies,
    })
);

export const getNuCaptchaRequired = createSelector(getCheckoutTriageState, (state) => state.nucaptchaRequired);

export const getDeviceLookupPrefillDataViewModel = createSelector(getNormalizedQueryParams, ({ radioid, vin, verify }) => {
    if (radioid && !(verify && verify?.toLowerCase() === 'lastname')) {
        return { identifier: radioid, type: 'RadioId' };
    } else if (vin) {
        return { identifier: vin, type: 'VIN' };
    } else {
        return null;
    }
});

// TODO: Temporary selector to display pyp Other Offer Link. Programcode should not be used directly in the logic. Instead offer parameters should set the conditions.
export const getOtherOffersLinkEligible = createSelector(getNormalizedQueryParams, ({ programcode, pyp }) => {
    return !!programcode && programcode.toUpperCase() === '3FOR1MM' && !!pyp && pyp?.toUpperCase() === 'Y';
});
