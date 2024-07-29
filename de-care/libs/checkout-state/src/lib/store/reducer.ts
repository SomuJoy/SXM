// ===============================================================================
// Internal Features (Store)
import * as fromCheckout from './actions';
import { initialCheckoutState, CheckoutState } from './state';
import { ContestParams, OfferNotAvailableReasonEnum } from '@de-care/data-services';
import { createReducer, on, Action } from '@ngrx/store';

const reducer = createReducer(
    initialCheckoutState,
    on(fromCheckout.resetCheckoutStateToInitial, () => ({ ...initialCheckoutState })),
    on(fromCheckout.LoadLeadOfferPackageName, (state, action) => {
        return {
            ...state,
            leadOfferPackageName: action.payload.offers[0].packageName,
            leadOfferType: action.payload.offers[0].type,
        };
    }),
    on(fromCheckout.LoadCheckout, (state, action) => {
        return {
            ...state,
            programCode: action.payload.programId || state.programCode,
            upsellCode: action.payload.upsellCode || state.upsellCode,
            renewalCode: action.payload.renewalCode || state.renewalCode,
            loading: true,
        };
    }),
    on(fromCheckout.LoadCheckoutSuccess, (state, action) => {
        // Immutability principle
        return {
            ...state, // The incoming state
            offer: action.payload.offer, // Checkouts from the server
            account: action.payload.account,
            isTokenizedLink: action.payload.isTokenizedLink,
            loaded: true, // The plans were loaded
            loading: false, // Turn loading indicator off
        };
    }),
    on(fromCheckout.LoadCheckoutFlepz, (state, action) => {
        return {
            ...state,
            programCode: action.payload.programId || state.programCode,
            upsellCode: action.payload.upsellCode || state.upsellCode,
            loading: true,
        };
    }),
    on(fromCheckout.LoadCheckoutFlepzAccount, (state, action) => {
        return {
            ...state,
            account: action.payload.account,
            ...(!!action.payload.offer && { offer: action.payload.offer }),
        };
    }),
    on(fromCheckout.LoadCheckoutClosedRadioInfo, (state, action) => {
        return {
            ...state,
            closedRadioInfo: {
                accountNumber: action.payload.accountNumber,
                closedRadio: action.payload.account.closedDevices[0],
            },
        };
    }),
    on(fromCheckout.LoadCheckoutFlepzSuccess, (state, action) => {
        return {
            ...state,
            offer: action.payload.offer,
            account: null,
            loaded: true,
            loading: false,
        };
    }),
    on(fromCheckout.LoadCheckoutError, (state, action) => {
        return {
            ...state,
            error: action.payload,
            loaded: false,
            loading: false,
        };
    }),
    on(fromCheckout.LoadCheckoutFlepzError, (state, action) => {
        return {
            ...state,
            error: action.payload,
            loaded: false,
            loading: false,
        };
    }),
    on(fromCheckout.LoadCheckoutFlepzAccountError, (state, action) => {
        return {
            ...state,
            error: action.payload,
        };
    }),

    // The server supplied plans,
    on(fromCheckout.UpdatePlan, (state, action) => {
        // Immutability principle
        return {
            ...state, // The incoming state
            offer: action.payload, // Checkouts from the server
        };
    }),
    on(fromCheckout.UpdateCheckoutAccount, (state, action) => {
        return {
            ...state,
            account: action.payload,
        };
    }),
    // Selected upsells,
    on(fromCheckout.SelectedUpsell, (state, action) => {
        // Immutability principle
        return {
            ...state, // The incoming state
            selectedOffer: action.payload, // Checkouts from the server
        };
    }),
    // Clear Selected upsells,
    on(fromCheckout.ClearUpsell, (state, action) => {
        // Immutability principle
        return {
            ...state, // The incoming state
            selectedOffer: null, // Checkouts from the server
        };
    }),

    on(fromCheckout.RegisterAccount, (state, action) => {
        return {
            ...state,
            registrationError: null,
        };
    }),

    // Set Response from Account signup,
    on(fromCheckout.RegisterAccountRes, (state, action) => {
        return {
            ...state,
            account: {
                ...state.account,
                accountProfile: action.payload,
            },
        };
    }),
    on(fromCheckout.RegisterAccountError, (state, action) => {
        // Immutability principle
        return {
            ...state,
            registrationError: action.payload,
        };
    }),
    on(fromCheckout.SetAccountActiveSubscription, (state, action) => {
        return {
            ...state,
            programCode: action.payload.programCode,
            activeSubscriptionFound: true,
            account: {
                ...state.account,
                subscriptions: [action.payload.subscription],
            },
            loaded: true,
            loading: false,
        };
    }),
    on(fromCheckout.ClearActiveSubscriptionFound, (state, action) => {
        return {
            ...state,
            activeSubscriptionFound: false,
            error: null,
        };
    }),
    on(fromCheckout.CheckRTCFlow, (state, action) => {
        return {
            ...state,
            offer: action.payload.leadOffer,
            loadingRTC: true,
        };
    }),
    on(fromCheckout.LoadRenewalOfferPackages, (state, action) => {
        return {
            ...state,
            loadingRTC: true,
        };
    }),
    on(fromCheckout.LoadRenewalOfferPackagesSuccess, (state, action) => {
        return {
            ...state,
            loadingRTC: false,
            renewalPackageOptions: action.payload,
        };
    }),
    on(fromCheckout.SetSelectedRenewalPlan, (state, action) => {
        return {
            ...state,
            selectedRenewalPackageName: action.payload.packageName,
        };
    }),
    on(fromCheckout.SetDefaultRenewalPlan, (state, action) => {
        return {
            ...state,
            defaultRenewalPackageName: action.payload.packageName,
        };
    }),
    on(fromCheckout.SetRTCTrue, (state, action) => {
        return {
            ...state,
            isRTC: true,
        };
    }),
    on(fromCheckout.SetRTCFalse, (state, action) => {
        return {
            ...state,
            isRTC: false,
            loadingRTC: false,
        };
    }),
    on(fromCheckout.SetProactiveRTCTrue, (state, action) => {
        return {
            ...state,
            isProactiveRTC: true,
        };
    }),
    on(fromCheckout.SetPickAPlanOrganicTrue, (state, action) => {
        return {
            ...state,
            isPickAPlanOrganic: true,
        };
    }),
    on(fromCheckout.SetSweepstakesInfo, (state, action) => {
        const contestId = action.payload[ContestParams.contestId];
        const contestUrl = action.payload[ContestParams.contestUrl];

        return {
            ...state,
            sweepstakes: {
                id: contestId,
                officialRulesUrl: contestUrl,
            },
        };
    }),
    on(fromCheckout.SetSweepstakesEligible, (state, action) => {
        return {
            ...state,
            sweepstakesEligible: true,
        };
    }),
    on(fromCheckout.SetSweepstakesIneligible, (state, action) => {
        return {
            ...state,
            sweepstakesEligible: false,
        };
    }),
    on(fromCheckout.SetOrderSummaryDetailsExpandedTrue, (state, action) => {
        return {
            ...state,
            orderSummaryDetailsExpanded: true,
        };
    }),
    on(fromCheckout.SetOrderSummaryDetailsExpandedFalse, (state, action) => {
        return {
            ...state,
            orderSummaryDetailsExpanded: false,
        };
    }),
    on(fromCheckout.SetIsStreaming, (state, action) => {
        return {
            ...state,
            isStreaming: action.payload.isStreaming,
        };
    }),
    on(fromCheckout.SetOfferNotAvailable, (state, action) => {
        return {
            ...state,
            offerNotAvailableInfo: {
                offerNotAvailable: true,
                offerNotAvailableAccepted: false,
                offerNotAvailableReason: action.payload,
            },
        };
    }),
    on(fromCheckout.SetOfferNaAccepted, (state, action) => {
        return {
            ...state,
            offerNotAvailableInfo: {
                ...state.offerNotAvailableInfo,
                offerNotAvailableAccepted: action.payload,
            },
        };
    }),
    on(fromCheckout.IngressStudentVerificationIdValidateSuccess, (state, action) => {
        return {
            ...state,
            isStudentFlow: true,
        };
    }),
    on(fromCheckout.IngressStudentVerificationIdValidateFallback, fromCheckout.IngressNonStudent, fromCheckout.IngressStudentVerificationIdValidateError, (state, action) => {
        return {
            ...state,
            isStudentFlow: false,
        };
    }),
    on(fromCheckout.SetMaskedUserNameFromToken, (state, action) => {
        return {
            ...state,
            maskedUserName: action.payload,
        };
    }),
    on(fromCheckout.IngressStudnetVerificationWithAccountModel, (state, action) => {
        return {
            ...state,
            isActiveStudentAccount: true,
        };
    }),
    on(fromCheckout.setPromoCode, (state, action) => {
        return {
            ...state,
            promoCode: action.promoCode,
        };
    }),
    on(fromCheckout.setIsPromoCodeValid, (state, action) => {
        return {
            ...state,
            isPromoCodeValid: action.isValid,
        };
    }),
    on(fromCheckout.setPromoCodeInvalidReason, (state, action) => {
        return {
            ...state,
            promocodeInvalidReason: action.reason,
        };
    }),
    on(fromCheckout.setDefaultOfferBehavior, (state, action) => {
        return {
            ...state,
            defaultOfferBehavior: {
                isProgramCodeNotValid: true,
                programCodeStatus: action.programCodeStatus as OfferNotAvailableReasonEnum,
            },
        };
    }),
    on(fromCheckout.resetDefaultOfferBehavior, (state) => {
        return {
            ...state,
            defaultOfferBehavior: initialCheckoutState.defaultOfferBehavior,
        };
    }),
    on(fromCheckout.SetSelectedOfferPackageName, (state, action) => {
        return {
            ...state,
            selectedOfferPackageName: action.payload.packageName,
        };
    }),
    on(fromCheckout.SetSelectedOfferPlanCode, (state, action) => {
        return {
            ...state,
            selectedOfferPlanCode: action.payload.planCode,
        };
    }),
    on(fromCheckout.SetCanUseDetailedGrid, (state, action) => {
        return {
            ...state,
            canUseDetailedGrid: action.payload.canUseDetailedGrid,
        };
    }),
    on(fromCheckout.SetSelectedOfferChoicePlan, (state, action) => {
        return {
            ...state,
            selectedOffer: action.payload,
        };
    })
);

export function checkoutReducer(state: CheckoutState | undefined, action: Action) {
    return reducer(state, action);
}
