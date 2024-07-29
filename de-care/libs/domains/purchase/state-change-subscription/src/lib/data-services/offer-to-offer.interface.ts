export interface OfferToOfferRequest {
    subscriptionId: number;
    plans: Array<{ plancode: string }>;
}

export interface OfferToOfferResponse {
    status: string;
    readioId?: string;
    subscriptionId: number;
    isUserNameSameAsEmail?: boolean;
    isEligibleForRegistration?: boolean;
    isOfferStreamingEligible?: boolean;
}
