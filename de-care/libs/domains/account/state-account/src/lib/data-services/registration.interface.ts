export interface RegisterDataModel {
    userName?: string;
    password?: string;
    email?: string;
    phone: string;
    securityQuestions: SecurityQuestionsModel[];
    cna?: {
        firstName: string;
        lastName: string;
        email: string;
        phone: number;
        address: {
            avsvalidated: boolean;
            serviceAddress: boolean;
            streetAddress: string;
            city: string;
            state: string;
            postalCode: number;
        };
    };
}

export interface SecurityQuestionsModel {
    id?: number;
    answer?: string;
}

export interface RegisterResponseDataModel {
    status: 'SUCCESS' | 'FAILURE';
    passwordValidationResult: PasswordValidationResult;
}

export interface PasswordValidationResult {
    validationErrorKey: string;
    validationErrorFailedWord: string;
    isValid: boolean;
}

export class RegisterPasswordError {
    constructor(public readonly key: string, public readonly reservedWords: string[]) {}
}
