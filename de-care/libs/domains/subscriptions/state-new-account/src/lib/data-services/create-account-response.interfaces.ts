export interface CreateAccountResponse {
    email: string;
    status: string;
    radioId: string;
    subscriptionId: number;
    accountNumber: string;
    isUserNameSameAsEmail: boolean;
    isOfferStreamingEligible: boolean;
    isEligibleForRegistration: boolean;
    isRefreshAllowed: boolean;
}
