export interface VerificationMethods {
    phone: { eligible: boolean; verified: boolean };
    radioId: { eligible: boolean; verified: boolean };
    accountNumber: { eligible: boolean; verified: boolean };
    email: { eligible: boolean; verified: boolean };
}

export interface RegisterWidgetState {
    verificationMethods: VerificationMethods;
    verificationOptionsStatus: {
        inProgress: boolean;
        hasError: boolean;
    };
}
