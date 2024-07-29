// ===============================================================================
// Internal Features (Store)
import { CheckoutState } from './state';

// ===============================================================================
// External Features (Data Services)
// import { OfferModel } from '../../data-services';
import { PackageModel } from '@de-care/data-services';

// ===============================================================================
// Libs
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { getCheckoutState } from './selectors';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

export const getRenewalPackageOptions: MemoizedSelector<object, PackageModel[]> = createSelector(getCheckoutState, (state: CheckoutState) => state.renewalPackageOptions);

export const getContainsChoicePackages = createSelector(
    getRenewalPackageOptions,
    (renewalOffers) => !!renewalOffers?.map((offer) => offer?.parentPackageName).find((pkgName) => pkgName?.includes('CHOICE'))
);

export const getChoiceGenreRenewalPackageOptions = createSelector(getRenewalPackageOptions, (offers) =>
    offers.filter((offer) => offer && offer?.parentPackageName && offer.parentPackageName.indexOf('CHOICE') !== -1).map((offer) => offer.packageName)
);

export const getDefaultRenewalPackageName = createSelector(getCheckoutState, (state: CheckoutState) => state.defaultRenewalPackageName);

export const getSelectedRenewalPackageName = createSelector(getCheckoutState, (state: CheckoutState) => state.selectedRenewalPackageName);

export const getIsRtc: MemoizedSelector<object, boolean> = createSelector(getCheckoutState, (state: CheckoutState) => state.isRTC);

export const getLoadingRtc: MemoizedSelector<object, boolean> = createSelector(getCheckoutState, (state: CheckoutState) => state.loadingRTC);

export const getIsProactiveRtc = createSelector(getCheckoutState, (state: CheckoutState) => state.isProactiveRTC);

export const getSelectedRenewalOffer = createSelector(
    getRenewalPackageOptions,
    getSelectedRenewalPackageName,
    getDefaultRenewalPackageName,
    (renewalOptions, selectedRenewalPackageName, defaultRenewalPackageName) => {
        const packageName = selectedRenewalPackageName || defaultRenewalPackageName;
        if (packageName && renewalOptions) {
            return renewalOptions.find((option) => option.packageName === packageName);
        }
        return null;
    }
);

const getIsProactiveRTCFlow = createSelector(getCheckoutState, (state) => state.isProactiveRTC);

export const getAddGenreStep = createSelector(
    getIsProactiveRTCFlow,
    getSelectedRenewalPackageName,
    (isProactive, packageName) => !!packageName && packageName?.indexOf('CHOICE') !== -1 && isProactive
);

export const getSelectedRenewalOfferRetailPrice = createSelector(getSelectedRenewalOffer, (renewallOffer) => (renewallOffer ? renewallOffer.retailPrice : null));

export const getSelectedRenewalOfferPlanCodeAndPrice = createSelector(getSelectedRenewalOffer, (renewalOffer) => ({
    planCode: renewalOffer.planCode,
    price: renewalOffer.price,
}));

export const getRenewalPlanCode = createSelector(
    getSelectedRenewalPackageName,
    getRenewalPackageOptions,
    getDefaultRenewalPackageName,
    (selectedPackageName, renewalPackageOptions, defaultRenewalPackageName) => {
        if (renewalPackageOptions && (!!selectedPackageName || !!defaultRenewalPackageName)) {
            const packageName = selectedPackageName || defaultRenewalPackageName;
            const selectedRenewalPackage = renewalPackageOptions.find((option) => option.packageName === packageName);
            return selectedRenewalPackage ? selectedRenewalPackage.planCode : null;
        }
        return null;
    }
);

// TODO: Temporary solution: hardcoded programcode should not be part of the logic. Nedds to be refactored
export const getCodeIs3For1AARtc = createSelector(getNormalizedQueryParams, (queryParams) => queryParams?.programcode?.toUpperCase() === '3FOR1AARTC');
