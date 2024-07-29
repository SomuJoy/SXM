import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import {
    selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode,
    selectOfferInfosForCurrentLocaleMappedByPlanCode,
} from '@de-care/domains/offers/state-offers-info';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ZeroCostState, featureKey } from './reducer';

export const featureState = createFeatureSelector<ZeroCostState>(featureKey);
export const getPromoCodeFromInboundQueryParams = createSelector(featureState, (state) => state.inboundQueryParams?.promocode);
export const getSelectedPlanCode = createSelector(featureState, (state) => state.selectedPlanCode);
export const getSelectedOffer = createSelector(getAllOffersAsArray, getSelectedPlanCode, (offers, planCode) => offers.find((offer) => offer.planCode === planCode));
export const getSelectedOfferInfoHero = createSelector(getSelectedPlanCode, selectOfferInfoSalesHeroForCurrentLocaleMappedByPlanCode, (planCode, hero) => hero[planCode]);
export const getSelectedOfferOfferInfoOfferDescription = createSelector(
    getSelectedPlanCode,
    selectOfferInfoOfferDescriptionForCurrentLocaleMappedByPlanCode,
    (planCode, offerDescription) => (planCode ? offerDescription?.[planCode] : null)
);
export const getSelectedOfferOfferInfoDetails = createSelector(getSelectedPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return offersInfo[planCode];
});
export const getSelectedOfferOfferInfoLegalCopy = createSelector(selectOfferInfoLegalCopyForCurrentLocaleMappedByPlanCode, getSelectedPlanCode, (offerDetails, planCode) =>
    planCode ? offerDetails?.[planCode] : null
);
export const getDeviceInfo = createSelector(featureState, (state) => state?.deviceInfo);
export const getDeviceVehicleInfo = createSelector(getDeviceInfo, (deviceInfo) => {
    if (deviceInfo?.vehicleInfo?.year && deviceInfo?.vehicleInfo?.make && deviceInfo?.vehicleInfo?.model) {
        return deviceInfo.vehicleInfo;
    }
    return null;
});
export const getDeviceRadioId = createSelector(getDeviceInfo, (deviceInfo) => deviceInfo?.last4DigitsOfRadioId);
export const getCustomerInfo = createSelector(featureState, (state) => state?.customerInfo);

export const getOffersRequestData = createSelector(getPromoCodeFromInboundQueryParams, (marketingPromoCode) => ({
    marketingPromoCode,
    streaming: false, // TODO: figure out what to do about that streaming flag
}));
export const getCustomerOffersRequestData = createSelector(getPromoCodeFromInboundQueryParams, getDeviceRadioId, (marketingPromoCode, last4DigitsOfRadioId) => ({
    marketingPromoCode,
    radioId: last4DigitsOfRadioId,
    streaming: false, // TODO: figure out what to do about that streaming flag
}));
export const getSubmitCheckoutRequestData = createSelector(
    featureState,
    getPromoCodeFromInboundQueryParams,
    getDeviceInfo,
    getCustomerInfo,
    ({ selectedPlanCode }, marketingPromoCode, { last4DigitsOfRadioId }, { serviceAddress, ...customerInfo }) => ({
        plans: [{ planCode: selectedPlanCode }],
        marketingPromoCode,
        radioId: last4DigitsOfRadioId,
        serviceAddress: {
            avsvalidated: serviceAddress.avsValidated,
            streetAddress: serviceAddress.addressLine1,
            city: serviceAddress.city,
            state: serviceAddress.state,
            postalCode: serviceAddress.zip,
            country: serviceAddress.country,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            phone: customerInfo.phoneNumber,
            email: customerInfo.email,
        },
    })
);
