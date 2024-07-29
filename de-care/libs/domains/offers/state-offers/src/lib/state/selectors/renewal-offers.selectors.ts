import { createSelector } from '@ngrx/store';
import { selectFeature } from './feature.selectors';

export const getRenewalOffers = createSelector(selectFeature, (state) => state.renewalOffers);
export const getRenewalOffersAsArray = createSelector(getRenewalOffers, (renewalOffers) => (!!renewalOffers && Array.isArray(renewalOffers) ? renewalOffers : []));
export const getRenewalOffersFirstOffer = createSelector(getRenewalOffersAsArray, (renewalOffersAsArray) => renewalOffersAsArray?.[0]);
export const getRenewalOffersFirstOfferPlanCode = createSelector(getRenewalOffersFirstOffer, (renewalOffersFirstOffer) => renewalOffersFirstOffer?.planCode);
export const getRenewalOffersPackageNames = createSelector(getRenewalOffersAsArray, (renewalOffers) => renewalOffers.map((p) => p.packageName));
export const getSelectedRenewalPackageName = createSelector(selectFeature, (state) =>
    state.renewalOffers && Array.isArray(state.renewalOffers) && state.renewalOffers.length > 0
        ? state.selectedRenewalPackageName || state.renewalOffers[0].parentPackageName
        : null
);
export const getRenewalOffersPlanCodes = createSelector(getRenewalOffersAsArray, (renewalOffers) => renewalOffers.map((p) => p.planCode));
export const getSelectedRenewalPrice = createSelector(getSelectedRenewalPackageName, getRenewalOffers, (renewalPackageName, renewalOffers) => {
    const availableInfo = !!renewalPackageName && !!renewalOffers && Array.isArray(renewalOffers) && renewalOffers?.length > 0;
    return availableInfo ? renewalOffers?.filter((offer) => offer.packageName === renewalPackageName).map((offer) => offer.price)[0] : null;
});
export const getSelectedRenewalTermLength = createSelector(getSelectedRenewalPackageName, getRenewalOffers, (renewalPackageName, renewalOffers) => {
    const availableInfo = !!renewalPackageName && !!renewalOffers && Array.isArray(renewalOffers) && renewalOffers?.length > 0;
    return availableInfo ? renewalOffers?.filter((offer) => offer.packageName === renewalPackageName).map((offer) => offer.termLength)[0] : null;
});

export const getRenewalsIncludesChoice = createSelector(getRenewalOffersAsArray, (renewals) =>
    renewals.some((offer) => offer?.parentPackageName && offer?.parentPackageName.toLowerCase().indexOf('choice') !== -1)
);

export const getIsNOUVChoiceOrMM = createSelector(getRenewalOffersAsArray, getRenewalsIncludesChoice, (renewalOffers, includesChoice) => {
    const numOfOffers = renewalOffers.filter((offer) => !offer?.parentPackageName).length;
    if (includesChoice) {
        return numOfOffers === 2;
    }
    return numOfOffers === 3;
});

export const getRenewalsSingleType = createSelector(getRenewalOffersAsArray, getRenewalsIncludesChoice, (renewals, includesChoice) => {
    if (includesChoice) {
        const firstChoice = renewals[0];
        return [firstChoice, ...renewals.filter((offer) => !offer?.parentPackageName)];
    } else {
        return renewals;
    }
});
export const getRenewalOffersFirstOfferPrice = createSelector(getRenewalOffersAsArray, (renewalOffersAsArray) => renewalOffersAsArray?.[0]?.msrpPrice);
