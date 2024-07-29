export interface ServiceContinuityResponse {
    isUserNameSameAsEmail: boolean;
    email: string;
    status: string;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
    isEligibleForRegistration: boolean;
    radioId?: string;
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
    transactionId: string;
    giftCards?: string[];
    paymentType?: string;
    paymentAmount?: number;
}

export interface PlansModel {
    planCode: string;
}

export type TransationType = 'SERVICE_CONTINUITY' | 'SERVICE_PORTABILITY';

export interface ServiceContinuityRequest {
    trialRadioId: string;
    selfPayRadioId: string;
    followOnPlans: { planCode: string }[];
    paymentInfo: PaymentInfoModel;
    removeCarFromAccount: boolean;
    transactionType: TransationType;
}
