export type VerifyType = 'email' | 'text' | 'radioId' | 'accountNumber';

export interface VerifyTypeSelection {
    verifyType: VerifyType;
    identifier?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface SendVerificationCodeRequest {
    phoneNumber: string;
    langPref?: string;
}

export interface VerifyPhoneResponse {
    status: boolean;
}

export interface VerifyCodeRequest {
    securityCode: number;
}

export const enum VerifyCodeStatus {
    'success' = 'success',
    'incorrect' = 'incorrect',
    'limitExceeded' = 'limitExceeded',
    'error' = 'error',
}

export interface VerifyCodeResponse {
    status: VerifyCodeStatus;
}
