export interface AddSubscriptionResponse {
    isUserNameSameAsEmail: boolean;
    email: string;
    accountNumber: string;
    status: string;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
    radioId?: string;
    isEligibleForRegistration: boolean;
    isEligibleForStreamingCredentialsOnly?: boolean;
    subscriptions: object;
    maskedStreamingUserName?: string;
    isRefreshAllowed?: boolean;
}

export interface PaymentInfoModel {
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
}

export interface PlansModel {
    planCode: string;
}

export interface Address {
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

export interface Plan {
    discountPlans?: [
        {
            planCode: string;
        }
    ];
    packageName?: string;
    planCode?: string;
    planSource?: string;
}

export interface AddSubscriptionRequest {
    emailAddressChanged?: boolean;
    accountNumber?: string;
    radioId: string;
    paymentInfo?: PaymentInfoModel;
    billingAddress?: Address;
    serviceAddress?: Address;
    followOnPlans?: Plan[];
    plans?: Plan[];
    marketingPromoCode: string;
    languagePreference?: string;
}
