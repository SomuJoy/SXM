export interface ChangeSubscriptionResponse {
    isUserNameSameAsEmail: boolean;
    email: string;
    accountNumber: string;
    status: string;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
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

export interface PurchaseStreamingInfo {
    login?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
}

export interface PlansModel {
    planCode: string;
}

export interface SubscriptionChangeRequest {
    subscriptionId: string;
    paymentInfo: PaymentInfoModel;
    plans?: PlansModel[];
    followOnPlans?: PlansModel[];
    streamingInfo?: PurchaseStreamingInfo;
}
