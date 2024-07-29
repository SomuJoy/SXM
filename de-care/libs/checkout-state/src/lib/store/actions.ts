// ===============================================================================
// Libs: Ngrx Packages
import { createAction, props, union } from '@ngrx/store';

// ===============================================================================
// Imported Features (Data Services)
import {
    SweepstakesModel,
    UpsellRequestData,
    AccountModel,
    OfferModel,
    RegisterDataModel,
    SecurityQuestionsModel,
    SweepstakesActionParams,
    SubscriptionModel,
    PackagePlatformEnum,
    OfferRenewalRequestModel,
    PackageModel,
    OfferNotAvailableReasonEnum,
    TokenPayloadType,
} from '@de-care/data-services';
import { HandleRTCStreamingParams } from '../config/types';
import { Account } from '@de-care/domains/account/state-account';

//================================================
//===     Action Types Constants (Checkout)    ===
//================================================
export const LOAD_LEAD_OFFER_PACKAGE_NAME = '[Checkout] Set Lead Offer';
export const LOAD_CHECKOUT = '[Checkout] Load Checkout';
export const LOAD_CHECKOUT_SUCCESS = '[Checkout] Load Checkout Success';
export const LOAD_CHECKOUT_ERROR = '[Checkout] Load Checkout Error';

export const LOAD_CHECKOUT_FLEPZ = '[Checkout] Load Checkout Flepz';
export const LOAD_CHECKOUT_FLEPZ_SUCCESS = '[Checkout] Load Checkout Flepz Success';
export const LOAD_CHECKOUT_FLEPZ_ERROR = '[Checkout] Load Checkout Flepz Error';

export const LOAD_CHECKOUT_FLEPZ_ACCOUNT = '[Checkout] Load Checkout Flepz Account';
export const LOAD_CHECKOUT_FLEPZ_ACCOUNT_ERROR = '[Checkout] Load Checkout Flepz Account Error';

export const LOAD_CHECKOUT_CLOSED_RADIO = '[Checkout] Load Checkout Closed Radio';

export const PARSE_OFFER = '[Checkout] Parse Offer';

export const UPDATE_PLAN = '[Checkout] Update Offer';

export const UPDATE_CHECKOUT_ACCOUNT = '[Checkout] Update Account';

export const SELECTED_UPSELL = '[Checkout] Selected Upsell';
export const CLEAR_UPSELL = '[Checkout] Clear Upsell';

export const REGISTER_ACCOUNT = '[Register] Register Account';
export const REGISTER_ACCOUNT_RES = '[Register] Register Account Response';
export const REGISTER_ACCOUNT_ERROR = '[Register] Register Account Error';

export const GET_SECURITY_QUESTIONS = '[Utilities] Getting Security Questions';
export const SET_SECURITY_QUESTIONS = '[Utilities] Adding Security Questions';

export const SYSTEM_ERROR = '[Checkout] System Error';
export const SERVICE_ERROR = '[Checkout] Service Error';

export const SET_ACCOUNT_ACTIVE_SUBSCRIPTION = '[Checkout] Set account active subscription';
export const CLEAR_ACTIVE_SUBSCRIPTION_FOUND = '[Checkout] Clear active subscription found flag';

export const CHECK_RTC_FLOW = '[Checkout] Check for RTC requirements';
export const SET_RTC_TRUE = '[Checkout] Set RTC TRUE';
export const SET_RTC_FALSE = '[Checkout] Set RTC FALSE';
export const SET_PROACTIVE_RTC_TRUE = '[Checkout] Set Proactive RTC TRUE';
export const SET_PICK_A_PLAN_ORGANIC_TRUE = '[Checkout] Set Pick a plan organic TRUE';
export const SET_DEFAULT_RENEWAL_PLAN = '[Checkout] Set default Renewal plan';
export const SET_SELECTED_RENEWAL_PLAN = '[Checkout] Set selected Renewal plan';

export const LOAD_RENEWAL_OFFER_PACKAGES = '[Checkout] Load renewal offer packages';
export const LOAD_RENEWAL_OFFER_PACKAGES_SUCCESS = '[Checkout] Load renewal offer packages success';
export const LOAD_RENEWAL_OFFER_PACKAGES_ERROR = '[Checkout] Load renewal offer packages error';
export const SET_IS_STREAMING = '[Checkout] set is streaming';

export const SET_SWEEPSTAKES_INFO = '[Checkout] Set sweepstakes info';
export const SWEEPSTAKES_ELIGIBLE = '[Checkout] Set sweepstakes eligible';
export const SWEEPSTAKES_INELIGIBLE = '[Checkout] Set sweepstakes ineligible';

export const SET_ORDER_SUMMARY_DETAILS_EXPANDED_TRUE = '[Checkout] Set order summary details expanded to true';
export const SET_ORDER_SUMMARY_DETAILS_EXPANDED_FALSE = '[Checkout] Set order summary details expanded to false';

export const RTC_FLOW_CONTINUED = '[Checkout] Rtc Flow Continued';

export const SET_OFFER_NOT_AVAILABLE = '[Checkout] Set offer not available';
export const SET_OFFER_NA_ACCEPTED = '[Checkout] Set offer not available accepted';

export const INGRESS_STUDENT_VERIFICATION_ID_VALIDATE = '[Checkout] Student verification ingress from SheerID post-verification';
export const INGRESS_NON_STUDENT = '[Checkout] Non-student ingress to streaming flow';
export const INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_SUCCESS = '[Checkout] SheerId verificationId verified';
export const INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_FALLBACK = '[Checkout] SheerId verificationId fallback';
export const INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_ERROR = '[Checkout] SheerId verificationId failed verification';
export const INGRESS_STUDENT_VERIFICATION_NAME_AND_EMAIL = '[Checkout] Ingress Student Verification Name and Email';
export const INGRESS_STUDENT_VERIFICATION_WITH_ACCOUNT_MODEL = '[Checkout] Ingress Student Verification With Account Model interface';

export const SET_MASKED_USERNAME_FROM_TOKEN = '[Checkout] Set masked username from token';

//================================================
//===             Action Creators              ===
//================================================

export const LoadLeadOfferPackageName = createAction(LOAD_LEAD_OFFER_PACKAGE_NAME, props<{ payload: OfferModel }>());

export const LoadCheckout = createAction(
    LOAD_CHECKOUT,
    props<{
        payload: {
            programId: string;
            token: string;
            radioId: string;
            accountNumber: string;
            isStreaming?: boolean;
            account?: AccountModel;
            lastName: string;
            upsellCode: string;
            marketingPromoCode: string;
            renewalCode?: string;
            tbView?: string;
            proactiveFlow?: boolean;
            isIdentifiedUser?: boolean;
            tokenType?: TokenPayloadType;
        };
    }>()
);
export const LoadCheckoutSuccess = createAction(LOAD_CHECKOUT_SUCCESS, props<{ payload: { offer: OfferModel; account: AccountModel; isTokenizedLink: boolean } }>());

export const UpdateCheckoutAccount = createAction(UPDATE_CHECKOUT_ACCOUNT, props<{ payload: AccountModel }>());

export const RegisterAccount = createAction(REGISTER_ACCOUNT, props<{ payload: RegisterDataModel }>());

export const RegisterAccountError = createAction(REGISTER_ACCOUNT_ERROR, props<{ payload: any }>());

export const RegisterAccountRes = createAction(REGISTER_ACCOUNT_RES, props<{ payload: any }>());

//----------------------------------------------
export const LoadCheckoutFlepz = createAction(
    LOAD_CHECKOUT_FLEPZ,
    props<{ payload: { programId?: string; marketingPromoCode?: string; upsellCode?: string; platform?: PackagePlatformEnum; isStreaming?: boolean } }>()
);

export const LoadCheckoutFlepzSuccess = createAction(LOAD_CHECKOUT_FLEPZ_SUCCESS, props<{ payload: { offer: OfferModel } }>());

export const LoadCheckoutFlepzAccount = createAction(LOAD_CHECKOUT_FLEPZ_ACCOUNT, props<{ payload: { account: AccountModel; offer?: OfferModel } }>());

export const LoadCheckoutClosedRadioInfo = createAction(LOAD_CHECKOUT_CLOSED_RADIO, props<{ payload: { account: AccountModel; accountNumber: string } }>());

export const LoadCheckoutFlepzAccountError = createAction(LOAD_CHECKOUT_FLEPZ_ACCOUNT_ERROR, props<{ payload: Error }>());

export const LoadCheckoutError = createAction(LOAD_CHECKOUT_ERROR, props<{ payload: any }>());

export const LoadCheckoutFlepzError = createAction(LOAD_CHECKOUT_FLEPZ_ERROR, props<{ payload: any }>());

export const UpdatePlan = createAction(UPDATE_PLAN, props<{ payload: any }>());

export const SelectedUpsell = createAction(SELECTED_UPSELL, props<{ payload: any }>());

export const ClearUpsell = createAction(CLEAR_UPSELL);

export const SystemError = createAction(SYSTEM_ERROR, props<{ payload: any }>());

export const ServiceError = createAction(SERVICE_ERROR, props<{ payload: any }>());

export const SetAccountActiveSubscription = createAction(SET_ACCOUNT_ACTIVE_SUBSCRIPTION, props<{ payload: { subscription: SubscriptionModel; programCode: string } }>());

export const ClearActiveSubscriptionFound = createAction(CLEAR_ACTIVE_SUBSCRIPTION_FOUND);

// TODO create action for RTC packages?
export const CheckRTCFlow = createAction(CHECK_RTC_FLOW, props<{ payload: { leadOffer: OfferModel; params: HandleRTCStreamingParams } }>());

export const SetRTCTrue = createAction(SET_RTC_TRUE);

export const SetRTCFalse = createAction(SET_RTC_FALSE);

export const SetProactiveRTCTrue = createAction(SET_PROACTIVE_RTC_TRUE);
export const SetPickAPlanOrganicTrue = createAction(SET_PICK_A_PLAN_ORGANIC_TRUE);
export const SetDefaultRenewalPlan = createAction(SET_DEFAULT_RENEWAL_PLAN, props<{ payload: { packageName: string } }>());
export const SetSelectedRenewalPlan = createAction(SET_SELECTED_RENEWAL_PLAN, props<{ payload: { packageName: string } }>());

export const LoadRenewalOfferPackages = createAction(
    LOAD_RENEWAL_OFFER_PACKAGES,
    props<{ payload: { offerRenewalRequest: OfferRenewalRequestModel; defaultPackageName: string } }>()
);

export const LoadRenewalOfferPackagesSuccess = createAction(LOAD_RENEWAL_OFFER_PACKAGES_SUCCESS, props<{ payload: PackageModel[] }>());

export const LoadRenewalOfferPackagesError = createAction(LOAD_RENEWAL_OFFER_PACKAGES_ERROR, props<{ payload: Error }>());

export const SetSweepstakesInfo = createAction(SET_SWEEPSTAKES_INFO, props<{ payload?: SweepstakesActionParams }>());

export const SetSweepstakesEligible = createAction(SWEEPSTAKES_ELIGIBLE);

export const SetSweepstakesIneligible = createAction(SWEEPSTAKES_INELIGIBLE);

export const SetOrderSummaryDetailsExpandedTrue = createAction(SET_ORDER_SUMMARY_DETAILS_EXPANDED_TRUE);

export const SetOrderSummaryDetailsExpandedFalse = createAction(SET_ORDER_SUMMARY_DETAILS_EXPANDED_FALSE);

export const RtcFlowContinued = createAction(RTC_FLOW_CONTINUED, props<{ payload: { offer: OfferModel; params: HandleRTCStreamingParams } }>());

export const SetIsStreaming = createAction(SET_IS_STREAMING, props<{ payload: { isStreaming: boolean } }>());

export const SetOfferNotAvailable = createAction(SET_OFFER_NOT_AVAILABLE, props<{ payload: OfferNotAvailableReasonEnum }>());

export const SetOfferNaAccepted = createAction(SET_OFFER_NA_ACCEPTED, props<{ payload: boolean }>());

export const SetMaskedUserNameFromToken = createAction(SET_MASKED_USERNAME_FROM_TOKEN, props<{ payload: string }>());

export const IngressStudentVerificationIdValidate = createAction(INGRESS_STUDENT_VERIFICATION_ID_VALIDATE, props<{ verificationId: string }>());

export const IngressNonStudent = createAction(INGRESS_NON_STUDENT);

export const IngressStudentVerificationIdValidateSuccess = createAction(INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_SUCCESS, props<{ account: AccountModel }>());

export const IngressStudentVerificationIdValidateFallback = createAction(INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_FALLBACK);

export const IngressStudentVerificationIdValidateError = createAction(INGRESS_STUDENT_VERIFICATION_ID_VALIDATE_ERROR);

export const GetUpsells = createAction('[Checkout] Get upsells', props<{ payload: UpsellRequestData }>());

export const IngressStudentVerificationNameAndEmail = createAction(
    INGRESS_STUDENT_VERIFICATION_NAME_AND_EMAIL,
    props<{ firstName: string; lastName: string; email: string }>()
);

export const IngressStudnetVerificationWithAccountModel = createAction(INGRESS_STUDENT_VERIFICATION_WITH_ACCOUNT_MODEL, props<{ account: Account }>());

export const activeSubscriptionCloseRerouteToFlepz = createAction('[Checkout] re-route to Flepz');
export const activeSubscriptionCloseRerouteToProactiveRtc = createAction('[Checkout] re-route to Proactive Rtc');
export const buildDataLayerCustomerInfo = createAction('[Checkout] build DataLayer: CustomerInfo', props<{ isFlepz: boolean }>());
export const buildDataLayerPlanInfoProducts = createAction('[Checkout] build DataLayer: PlanInfoProducts', props<{ isFlepz: boolean }>());

export const setPromoCode = createAction('[Checkout] Set PromoCode', props<{ promoCode: string }>());
export const setIsPromoCodeValid = createAction('[Checkout] set is promo Code valid', props<{ isValid: boolean }>());
export const setPromoCodeInvalidReason = createAction('[Checkout] set is promo Code invalid reason', props<{ reason: string }>());

export const setDefaultOfferBehavior = createAction('[Checkout] Set Default Offer Behavior', props<{ programCodeStatus: string }>());
export const resetDefaultOfferBehavior = createAction('[Checkout] Reset Default Offer Behavior');

export const SetOfferRequest = createAction(
    '[Checkout] Set offer request',
    props<{
        programCode: string;
        marketingPromoCode: string;
        isStreaming: boolean;
        canadaProvince: string;
        renewalCode?: string;
    }>()
);

export const SetSelectedOfferPackageName = createAction('[Checkout] Set selected offer package name', props<{ payload: { packageName: string } }>());

export const SetSelectedOfferPlanCode = createAction('[Checkout] Set selected offer plan code', props<{ payload: { planCode: string } }>());

export const SetCanUseDetailedGrid = createAction('[Checkout] Set Can Use Detailed Grid', props<{ payload: { canUseDetailedGrid: boolean } }>());

export const GetOfferFromService = createAction(
    '[Checkout] Get offer from service ',
    props<{
        streaming: boolean;
        programCode: string;
        marketingPromoCode?: string;
        province?: string;
        student: boolean;
    }>()
);

export const resetCheckoutStateToInitial = createAction('[Checkout] Reset checkout-state to initial state data');
export const SetSelectedOfferChoicePlan = createAction('[Checkout] Set Selected Offer Choice Plan', props<{ payload: OfferModel }>());
