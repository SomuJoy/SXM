export interface RegisterDataModel {
    userName?: string;
    password?: string;
    securityQuestions: SecurityQuestionsModel[];
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
