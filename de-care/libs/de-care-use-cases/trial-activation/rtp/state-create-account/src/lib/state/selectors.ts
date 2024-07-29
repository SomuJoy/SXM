import { PlanTypeEnum } from '@de-care/domains/account/state-account';
import { selectRtpCreateAccountFeature } from './feature-selector';
import { createSelector } from '@ngrx/store';
import {
    getRenewalOffers,
    getOfferType,
    selectOffer,
    getOffersAsArrayModified,
    getOffersPackageNamesModified,
    getAllOffersAsArray,
    Offer
} from '@de-care/domains/offers/state-offers';
import { getSelectedRenewalPackageIsChoice } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';

export const getPrepaidRedeemAmount = createSelector(selectRtpCreateAccountFeature, state => state.prepaidRedeemAmount);
export const getPrepaidSuccessfullyAdded = createSelector(selectRtpCreateAccountFeature, state => state.prepaidSuccessfullyRedeemed);

export const getCreateAccountFormSubmitted = createSelector(selectRtpCreateAccountFeature, state => state.createAccountFormSubmitted);

export const getDisplayRtcGrid = createSelector(selectRtpCreateAccountFeature, state => state.displayRtcGrid);

export const getChoiceGenreRenewalPackageOptions = createSelector(getRenewalOffers, offers =>
    offers
        .filter(offer => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1)
        .map(offer => offer.packageName)
        .map(removeXMPreface)
        .sort(sortChoiceGenre)
);

enum ChoicePlanName {
    'SIR_AUD_CHOICE_CTRY',
    'SIR_AUD_CHOICE_HH',
    'SIR_AUD_CHOICE_POP',
    'SIR_AUD_CHOICE_CLROCK',
    'SIR_AUD_CHOICE_ROCK'
}

const removeXMPreface = (packageName: string): string => packageName.replace('1_', '');

const sortChoiceGenre = (a: string, b: string): number => (ChoicePlanName[a] > ChoicePlanName[b] ? 1 : ChoicePlanName[a] < ChoicePlanName[b] ? -1 : 0);

export const getIsNouvRtcAndNotChoice = createSelector(getOfferType, getSelectedRenewalPackageIsChoice, (offerType, isChoice) => offerType === 'TRIAL_EXT_RTC' && !isChoice);
export const getAddressEditionRequired = createSelector(selectRtpCreateAccountFeature, state => state.addressEditionRequired);

export const getShowReviewOrderTextInChooseGenre = createSelector(getOfferType, type => type !== PlanTypeEnum.RtdTrial);

export const getLeadOfferSelectionViewModel = createSelector(getOffersAsArrayModified, selectOffer, getOffersPackageNamesModified, (offers, leadOffer, packageNames) => ({
    planSelectionData: {
        packages: offers,
        selectedPackageName: leadOffer.packageName,
        leadOfferEndDate: leadOffer.planEndDate,
        leadOfferPackageName: leadOffer.packageName
    },
    planComparisonGridData: {
        packageNames,
        planComparisonGridParams: {
            selectedPackageName: leadOffer.packageName,
            familyDiscount: null,
            leadOfferPackageName: leadOffer.packageName,
            leadOfferTerm: leadOffer.termLength,
            trialEndDate: null
        },
        retailPrices: offers.map(offer => ({
            // TODO TEMPORARY PRICE PATCH UNTILL SMS RETURNS THE APPROPRIATE PRICE
            pricePerMonth: shouldMapQCChoicePrice(offer) ? 9.6 : offer.type === 'TRIAL_EXT' ? offer.msrpPrice : offer.pricePerMonth,
            mrdEligible: offer.mrdEligible
        }))
    }
}));

export const getChoiceGenreLeadOfferPackageOptions = createSelector(getAllOffersAsArray, offers =>
    offers.filter(offer => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1).map(offer => offer.packageName)
);

const shouldMapQCChoicePrice = (offer: Offer): boolean => offer.msrpPrice === 9.59 && offer.packageName.includes('SIR_CAN_CHOICE');
