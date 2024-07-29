// ===============================================================================
// Imported Models (Core)
import { OfferModel, AccountModel, ClosedDeviceModel, PackageModel, SweepstakesModel, OfferNotAvailableModel, OfferNotAvailableReasonEnum } from '@de-care/data-services';

// ===============================================================================
// Imported Features (Data Services)
// import { AccountModel, OfferModel } from '../../data-services';

//********************************************************************************
/* Properties of the Checkout Collection in store */
export interface CheckoutState {
    leadOfferPackageName: string;
    leadOfferType: string;
    offer: OfferModel;
    selectedOffer: OfferModel;
    account: AccountModel;
    programCode: string;
    renewalCode: string;
    promoCode: string;
    upsellCode: string;
    email: string;
    loaded: boolean;
    loading: boolean;
    loadingRTC: boolean;
    error: any;
    registrationError: any;
    done: boolean;
    isTokenizedLink: boolean;
    activeSubscriptionFound: boolean;
    isStreaming: boolean;
    isRTC: boolean;
    isProactiveRTC: boolean;
    isPickAPlanOrganic: boolean;
    defaultRenewalPackageName: string;
    selectedRenewalPackageName: string;
    renewalPackageOptions: PackageModel[];
    closedRadioInfo: {
        accountNumber: string;
        closedRadio: ClosedDeviceModel;
    };
    sweepstakes: SweepstakesModel | null;
    sweepstakesEligible: boolean;
    orderSummaryDetailsExpanded: boolean;
    offerNotAvailableInfo: OfferNotAvailableModel;
    isStudentFlow: boolean;
    maskedUserName: string;
    isPromoCodeValid: boolean;
    promocodeInvalidReason: string;
    defaultOfferBehavior: {
        isProgramCodeNotValid: boolean;
        programCodeStatus: OfferNotAvailableReasonEnum;
    };
    selectedOfferPackageName: string;
    selectedOfferPlanCode: string;
    canUseDetailedGrid: boolean;
}

// Initial Checkouts Collection values
export const initialCheckoutState: CheckoutState = {
    leadOfferPackageName: null,
    leadOfferType: null,
    offer: null,
    selectedOffer: null,
    account: null,
    programCode: null,
    renewalCode: null,
    promoCode: null,
    upsellCode: null,
    email: null,
    loaded: false,
    loading: false,
    loadingRTC: false,
    error: null,
    isStreaming: false,
    registrationError: null,
    done: false,
    isTokenizedLink: false,
    activeSubscriptionFound: false,
    isRTC: false,
    isProactiveRTC: false,
    defaultRenewalPackageName: null,
    selectedRenewalPackageName: null,
    renewalPackageOptions: null,
    closedRadioInfo: null,
    sweepstakes: null,
    sweepstakesEligible: false,
    orderSummaryDetailsExpanded: false,
    offerNotAvailableInfo: {
        // TODO: select this
        offerNotAvailable: false,
        offerNotAvailableAccepted: false,
        offerNotAvailableReason: null,
    },
    isStudentFlow: false,
    maskedUserName: null,
    isPromoCodeValid: false,
    promocodeInvalidReason: null,
    defaultOfferBehavior: {
        isProgramCodeNotValid: false,
        programCodeStatus: null,
    },
    selectedOfferPackageName: null,
    selectedOfferPlanCode: null,
    canUseDetailedGrid: false,
    isPickAPlanOrganic: false,
};
