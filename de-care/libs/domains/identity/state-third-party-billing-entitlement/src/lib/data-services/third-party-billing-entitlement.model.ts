export interface ThirdPatyBillingEntitlementData {
    isActive: boolean;
    resellerCode: string;
}

export interface ThirdPartyBillingActivationResponseData {
    resultCode: string;
    errorCode: string;
    errorMessage: string;
}

export interface ThirdPartyBillingActivationRequestData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    entitlementId: string;
}
