import { SweepstakesModel, OfferModel, OfferNotAvailableModel, OfferNotAvailableReasonEnum, EventErrorEnum } from '@de-care/data-services';
// ===============================================================================
// Internal Features (Store)
import { CheckoutState } from './state';
import { CHECKOUT_CONSTANT } from '../config';
// ===============================================================================
// Libs
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { getAllOffers } from '@de-care/domains/offers/state-offers';

export const getCheckoutState: MemoizedSelector<object, CheckoutState> = createFeatureSelector<CheckoutState>(CHECKOUT_CONSTANT.STORE.NAME);

export const getPackages: MemoizedSelector<object, OfferModel> = createSelector(getCheckoutState, (state: CheckoutState) => state.offer);

export const getActiveSubscriptionInfo = createSelector(getCheckoutState, (state: CheckoutState) => {
    if (state.activeSubscriptionFound && state.account) {
        const subscription = state.account.subscriptions[0];
        return {
            subscription,
        };
    } else {
        return null;
    }
});

export const getLeadOfferPackageName = createSelector(getCheckoutState, (state) => state.leadOfferPackageName);

export const checkoutIsLoading = createSelector(getCheckoutState, (state: CheckoutState) => (state && state.loading) || false);

export const getActiveSubscriptionFound = createSelector(getCheckoutState, (state) => state.activeSubscriptionFound);

export const getCheckoutLeadOffer = createSelector(getCheckoutState, (state) => state.offer);

export const getCheckoutLeadOfferPlanCode = createSelector(getCheckoutLeadOffer, (offer) => offer?.offers?.[0]?.planCode);
export const getCheckoutSelectedOfferPlanCode = createSelector(getCheckoutState, (state) => state.selectedOffer?.offers?.[0]?.planCode);

export const getSelectedOrLeadOfferPlanCode = createSelector(getCheckoutLeadOfferPlanCode, getCheckoutSelectedOfferPlanCode, (leadOfferPlanCode, selectedOfferPlanCode) => {
    return selectedOfferPlanCode ? selectedOfferPlanCode : leadOfferPlanCode;
});

export const getSelectedOfferPlanCode = createSelector(getCheckoutState, (state) => state?.selectedOfferPlanCode);

export const getSelectedPackageNameFromSelectedPlanCode = createSelector(
    getSelectedOfferPlanCode,
    getAllOffers,
    (planCode, offers) => offers.find((offer) => offer.planCode === planCode)?.packageName
);

export const getUpsellCode = createSelector(getCheckoutState, (state: CheckoutState) => state.upsellCode);

const _getSweepstakes = createSelector(getCheckoutState, (state: CheckoutState) => state.sweepstakes);

export const sweepstakesEligible = createSelector(_getSweepstakes, (state: SweepstakesModel | undefined) => {
    return state !== null && state.id !== undefined && state.id.length > 0;
});

export const sweepstakesId = createSelector(_getSweepstakes, sweepstakesEligible, (state: SweepstakesModel | undefined, isEligible: boolean) =>
    isEligible ? state.id : null
);

export const sweepstakesOfficialRulesUrl = createSelector(_getSweepstakes, sweepstakesEligible, (state: SweepstakesModel | undefined, isEligible: boolean) =>
    isEligible ? state.officialRulesUrl : null
);

export const sweepstakesInfo = createSelector(_getSweepstakes, sweepstakesEligible, (state: SweepstakesModel | undefined, isEligible: boolean) => (isEligible ? state : null));

export const getCheckoutAccount = createSelector(getCheckoutState, (state: CheckoutState) => state?.account);

export const getAccountServiceAddressState = createSelector(getCheckoutAccount, (account) => account?.serviceAddress?.state);

export const getActiveOrClosedRadioIdOnAccount = createSelector(getCheckoutAccount, (account) => {
    const activeRadioId = account?.subscriptions?.[0]?.radioService?.last4DigitsOfRadioId;
    if (activeRadioId) {
        return activeRadioId;
    } else {
        const closedRadioId = account?.closedDevices?.[0]?.last4DigitsOfRadioId;
        if (closedRadioId) {
            return closedRadioId;
        }
    }
    return null;
});

export const getIsOrderSummaryDetailsExpanded = createSelector(getCheckoutState, (state: CheckoutState) => state.orderSummaryDetailsExpanded);

export const getIsStreaming = createSelector(getCheckoutState, (state: CheckoutState) => state.isStreaming);

export const getOfferNotAvailable = createSelector(getCheckoutState, (state: CheckoutState) => state.offerNotAvailableInfo);

export const showOfferNotAvailable = createSelector(getOfferNotAvailable, (state: OfferNotAvailableModel) => state.offerNotAvailable && !state.offerNotAvailableAccepted);

export const getIsStudentFlow = createSelector(getCheckoutState, (checkoutState) => checkoutState.isStudentFlow);

export const selectIsPromoCodeValid = createSelector(getCheckoutState, (state: CheckoutState) => state.isPromoCodeValid);

export const getDefaultOfferBehavior = createSelector(getCheckoutState, (state: CheckoutState) => state.defaultOfferBehavior);

export const getDefaultOfferBehaviorReason = createSelector(getDefaultOfferBehavior, (state) => state.programCodeStatus);

export const showDefaultOfferBehavior = createSelector(
    getDefaultOfferBehavior,
    getIsStreaming,
    (defaultOfferBehavior, isStreaming) => defaultOfferBehavior.isProgramCodeNotValid && !isStreaming
);

const getRenewalOffers = createSelector(getCheckoutState, (state) => state.renewalPackageOptions);

export const getRenewalOffersAsArray = createSelector(getRenewalOffers, (renewalOffers) => (!!renewalOffers && Array.isArray(renewalOffers) ? renewalOffers : []));

export const getShowChoiceNotAvailableError = createSelector(getRenewalOffersAsArray, (offers) => {
    const fallback = offers.filter((offer) => offer.fallbackReason === OfferNotAvailableReasonEnum.RADIO_INELIGIBLE_FOR_CHOICE_PLAN);
    if (fallback && fallback[0] && fallback[0].fallback) {
        return true;
    }
    return false;
});

export const getStateError = createSelector(getCheckoutState, (state) => state?.error);
export const getStateErrorIsForExpiredOrInvalidOffer = createSelector(getCheckoutState, (state) => {
    const errorPropKey = state?.error?.exception?.error?.error?.errorPropKey;
    if (errorPropKey) {
        return errorPropKey === 'offer.service.expired.offer' || errorPropKey === 'offer.service.invalid.offer.code';
    }
    return false;
});
export const checkoutCouldHideLoader = createSelector(
    checkoutIsLoading,
    getStateError,
    (isLoading, stateError) => !isLoading && (!stateError || ![EventErrorEnum.InvalidToken].includes(stateError.message))
);

export const getPickAPlanSelectedOfferPackageName = createSelector(getCheckoutState, (state) => state.selectedOfferPackageName);
export const getCheckoutOffers = createSelector(getCheckoutState, (state) => state.offer);

export const getIsPickAPlanOrganic = createSelector(getCheckoutState, (state) => state.isPickAPlanOrganic);
export const getPromocodeInvalidReason = createSelector(getCheckoutState, (state) => state.promocodeInvalidReason);
