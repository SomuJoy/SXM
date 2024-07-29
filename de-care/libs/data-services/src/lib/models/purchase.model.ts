export interface PurchaseSubscriptionDataModel {
    emailAddressChanged?: boolean;
    accountNumber?: string;
    radioId: string;
    paymentInfo?: PurchaseSPaymentInfo;
    billingAddress?: PurchaseCSAddressModel;
    serviceAddress?: PurchaseCSAddressModel;
    followOnPlans?: PurchaseSFollowOnPlansModel[];
    plans?: PurchaseSFollowOnPlansModel[];
    marketingPromoCode: string;
    languagePreference?: string;
    isTwoFactorAuthNeeded?: boolean;
}

export interface PurchaseCreateAccountDataModel extends PurchaseSubscriptionDataModel {
    streamingInfo?: PurchaseStreamingInfo;
}

export interface PurchaseStreamingInfo {
    login?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
}

export interface PurchaseCSAddressModel {
    addressType?: string;
    company?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;
    phone?: string;
    specialNotes?: string;
    avsvalidated: boolean;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface PurchaseSFollowOnPlansModel {
    discountPlans?: [
        {
            planCode: string;
        }
    ];
    packageName?: string;
    planCode?: string;
    planSource?: string;
}

export interface PurchaseSPaymentInfo {
    cardInfo?: {
        cardNumber: string;
        cardType?: string;
        dateOfBirth?: string;
        expiryMonth: string;
        expiryYear: string;
        nameOnCard: string;
        securityCode?: string;
    };
    useCardOnfile: boolean;
    giftCards?: string[];
    paymentType?: string;
    paymentAmount?: number;
    transactionId?: string;
}

export interface PurchaseSubscriptionResponse {
    isUserNameSameAsEmail: boolean;
    email: string;
    status: string;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
    isEligibleForRegistration: boolean;
    isTwoFactorAuthNeeded: boolean;
    maskedPhoneNumber: string;
    subscriptions: object;
    accountNumber?: string;
    isRefreshAllowed?: boolean;
}

export interface TrialSubscriptionAccount {
    radioId: string;
    plans: {
        planCode: string;
    }[];
    streamingInfo: {
        login: string;
        password: string;
    };
}

export interface TrialSubscriptionResponse {
    email: string;
    status: string;
    isOfferStreamingEligible: boolean;
    isUserNameSameAsEmail: boolean;
    isEligibleForRegistration: boolean;
}
export interface PrepaidRedeemRequest {
    giftCardNumber: string;
    giftCardExpMonth?: string;
    giftCardExpYear?: string;
    securityCode?: string;
}
