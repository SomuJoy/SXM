import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import { getPaymentInfo, getAccountInfo, getLangPref, getOfferNotAvailableReason } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';

export const selectEmail = createSelector(getAccountInfo, (accountInfo) => accountInfo.email);
export const getSubmitOrderIsProcessing = createSelector(selectFeature, (state) => state.submitOrderIsProcessing || state.captchaValidationProcessing);

export const getBillingAddress = createSelector(getPaymentInfo, (paymentInfo) => paymentInfo?.billingAddress || null);
export const getServiceAddress = createSelector(getAccountInfo, (accountInfo) => accountInfo?.serviceAddress || null);

export const getFollowOnOptionSelected = createSelector(selectFeature, (state) => state.followOnOptionSelected);

export const getLangPrefAndOfferNotAvailableReason = createSelector(getLangPref, getOfferNotAvailableReason, (langPref, offerNotAvailableReason) => ({
    langPref,
    offerNotAvailableReason,
}));

export const getEligiblityCheckRequestData = createSelector(
    getFirstOfferPlanCode,
    getAccountInfo,
    getServiceAddress,
    getPaymentInfo,
    (planCode, { firstName, lastName, email }, { zip: zipCode }, paymentInfo) => ({
        planCode,
        firstName,
        lastName,
        email,
        zipCode,
        ...(paymentInfo?.ccNum && { creditCardNumber: paymentInfo?.ccNum }),
    })
);

const getSalesHeroData = createSelector(getFirstOfferPlanCode, selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, (planCode, salesHero) => salesHero[planCode] || null);
export const getSalesHeroCopyVM = createSelector(getSalesHeroData, (salesHeroData) => {
    if (salesHeroData) {
        return {
            ...salesHeroData,
            // TODO: get themes and turn these into classes that can be applied to the hero component
            //       not sure how this will work, but setting this as larger-padding for now
            classes: 'bottom-padding',
        };
    } else {
        return null;
    }
});
export const getOfferDescriptionVM = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescriptions) => offerDescriptions[planCode] || null
);
export const getLegalCopyData = createSelector(
    getFirstOfferPlanCode,
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    (planCode, legalCopy) => legalCopy[planCode] || null
);

export const getCaptchaValidationIsProcessing = createSelector(selectFeature, (state) => state.captchaValidationProcessing);
