export interface IEmailValidationResponse {
    verificationStatus: string;
    verificationMessage: string;
    suggestedEmail: string;
    valid: boolean;
}