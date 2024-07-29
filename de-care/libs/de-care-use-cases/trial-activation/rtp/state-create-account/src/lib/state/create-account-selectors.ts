import { getAccountSessionZipCode } from '@de-care/domains/account/state-session-data';
import { getVehicleInfo } from '@de-care/domains/device/state-device-info';
import { getIsOfferMCP, getOfferDetails, getRenewalOffers, getOfferType, OfferTypeEnum } from '@de-care/domains/offers/state-offers';
import { getIsCanadaMode } from '@de-care/settings';
import { createSelector } from '@ngrx/store';
import { selectRtpCreateAccountFeature } from './feature-selector';
import { getPrepaidRedeemAmount, getPrepaidSuccessfullyAdded, getDisplayRtcGrid, getShowReviewOrderTextInChooseGenre } from './selectors';

export const getPrepaidRedeemAddedInfo = createSelector(getPrepaidRedeemAmount, getPrepaidSuccessfullyAdded, (amount, success) => ({
    amount,
    success
}));

export const getPrepaidSuccessfullyRemoved = createSelector(selectRtpCreateAccountFeature, state => state.prepaidSuccessfullyRemoved);

export const getCreateAccountData = createSelector(
    getOfferDetails,
    getAccountSessionZipCode,
    getVehicleInfo,
    getIsOfferMCP,
    getShowReviewOrderTextInChooseGenre,
    (offerDetails, zipCode, vehicleInfo, isOfferMCP, showReviewOrderTextInChooseGenre) => ({
        offerDetails,
        zipCode,
        vehicleInfo,
        isOfferMCP,
        showReviewOrderTextInChooseGenre
    })
);

export const getOfferDetailsInfo = createSelector(getRenewalOffers, getIsCanadaMode, getCreateAccountData, (renewalOffers, isCanadaMode, createAccountData) => {
    if (isCanadaMode && renewalOffers && renewalOffers[0] && renewalOffers[0]?.msrpPrice) {
        createAccountData.offerDetails.msrpPrice = renewalOffers[0].msrpPrice;
    }
    return createAccountData.offerDetails;
});

export const getIsNouvTrialExtRtcFlow = createSelector(getOfferType, offerType => offerType === OfferTypeEnum.TrialExtensionRTC);

export const addPlanGridStepForTrialExtRtc = createSelector(getDisplayRtcGrid, getIsNouvTrialExtRtcFlow, (formSubmitted, isNouvRtcFlow) => formSubmitted && isNouvRtcFlow);

export { vmPlanGridSelectors } from '@de-care/domains/offers/state-offers';
