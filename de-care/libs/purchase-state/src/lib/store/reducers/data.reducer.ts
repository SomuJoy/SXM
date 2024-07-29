import { initialDataState, DataState } from '../states/data.state';
import * as PurchaseActions from '../actions/purchase.actions';
import { createReducer, on, Action } from '@ngrx/store';

const reducer = createReducer(
    initialDataState,
    on(PurchaseActions.resetPurchaseStateDataToInitial, () => ({ ...initialDataState })),
    on(PurchaseActions.LoadData, (state, action) => {
        return {
            ...state,
            programCode: action.payload.programCode,
            isLoading: false,
            account: action.payload.account,
            offer: action.payload.offer,
        };
    }),
    on(PurchaseActions.LoadFlepzDataSuccess, (state, action) => {
        return {
            ...state,
            account: action.payload.account,
            isLoading: false,
            programCode: action.payload.programCode,
            offer: action.payload.offer,
        };
    }),
    on(PurchaseActions.LoadQuote, PurchaseActions.LoadFlepzData, (state, action) => {
        return {
            ...state,
            isLoading: true,
        };
    }),
    on(PurchaseActions.PopulateQuote, (state, action) => {
        if (state.selectedOffer) {
            state.selectedOffer.offers[0].quote = action.payload;
        } else {
            state.offer.offers[0].quote = action.payload;
        }
        return {
            ...state,
            isLoading: false,
        };
    }),
    on(PurchaseActions.LoadSelectedOffer, (state, action) => {
        return {
            ...state,
            selectedOffer: action.payload,
        };
    }),
    on(PurchaseActions.UpdatePurchaseAccount, (state, action) => {
        return {
            ...state,
            account: action.payload,
        };
    }),
    on(PurchaseActions.UpdateOfferStreamingFlag, (state, action) => {
        return {
            ...state,
            isOfferStreamingEligible: action.payload,
        };
    }),
    on(PurchaseActions.UpdateIsAddSubscriptionFlag, (state, action) => {
        return {
            ...state,
            isAddSubscription: action.payload,
        };
    }),
    on(PurchaseActions.SetMarketingPromoCode, (state, action) => {
        return {
            ...state,
            hideMarketingPromoCode: action.payload.hidePromoCode || false,
            marketingPromoCode: action.payload.promocode,
        };
    }),
    on(PurchaseActions.ClearMarketingPromoCode, (state, action) => {
        return {
            ...state,
            marketingPromoCode: null,
        };
    }),
    on(PurchaseActions.SetPlatformChangedFlag, (state, action) => {
        return {
            ...state,
            platformChangedFlag: action.payload,
        };
    }),
    on(PurchaseActions.SetPlatformChangeUpsellDeferred, (state, action) => {
        return {
            ...state,
            platformChangeUpsellDeferred: action.upsellDeferred,
        };
    }),
    on(PurchaseActions.VerifyFlepzAccount, (state, action) => {
        return {
            ...state,
            isLoading: true,
        };
    }),
    on(PurchaseActions.UpdateRegistrationEligibilityFlag, (state, action) => {
        return {
            ...state,
            isEligibleForRegistration: action.payload,
        };
    }),
    on(PurchaseActions.UpdateIsTwoFactorAuthNeededFlag, (state, { isTwoFactorAuthNeeded }) => ({
        ...state,
        isTwoFactorAuthNeeded,
    })),
    on(PurchaseActions.UpdateMaskedPhoneNumber, (state, { maskedPhoneNumber }) => ({
        ...state,
        maskedPhoneNumber,
    })),
    on(PurchaseActions.setSuccessfulTransactionSubscriptionId, (state, { subscriptionId }) => ({
        ...state,
        successfulTransactionSubscriptionId: subscriptionId,
    })),
    on(PurchaseActions.LoadSelectedChoicePlan, (state, action) => {
        return {
            ...state,
            selectedOffer: action.payload,
        };
    }),

    on(PurchaseActions.setIsRefreshAllowed, (state, { isRefreshAllowed }) => ({ ...state, isRefreshAllowed: isRefreshAllowed }))
);

export function dataReducer(state: DataState, action: Action) {
    return reducer(state, action);
}
