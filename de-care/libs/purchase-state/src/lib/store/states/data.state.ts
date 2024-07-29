import { OfferModel, AccountModel } from '@de-care/data-services';

export interface DataState {
    offer: OfferModel;
    selectedOffer: OfferModel;
    isLoading: boolean;
    programCode: string;
    account: AccountModel;
    isOfferStreamingEligible: boolean;
    isAddSubscription: boolean;
    marketingPromoCode: string;
    hideMarketingPromoCode: boolean;
    platformChangedFlag: boolean;
    platformChangeUpsellDeferred: boolean;
    isEligibleForRegistration: boolean;
    isTwoFactorAuthNeeded: boolean;
    maskedPhoneNumber: string;
    successfulTransactionSubscriptionId: string;
    isRefreshAllowed?: boolean;
}

export const initialDataState: DataState = {
    offer: null,
    programCode: null,
    selectedOffer: null,
    isLoading: false,
    account: null,
    isOfferStreamingEligible: false,
    isAddSubscription: false,
    marketingPromoCode: null,
    hideMarketingPromoCode: false,
    platformChangedFlag: false,
    platformChangeUpsellDeferred: false,
    isEligibleForRegistration: false,
    isTwoFactorAuthNeeded: null,
    maskedPhoneNumber: null,
    successfulTransactionSubscriptionId: null,
    isRefreshAllowed: true,
};
