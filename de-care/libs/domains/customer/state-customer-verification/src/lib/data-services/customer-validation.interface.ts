export interface CustomerValidation {
    verifyThirdParty?: boolean;
    email?: {
        email: string;
        streaming?: boolean;
    };
    username?: {
        userName: string;
        accountNumber?: string;
        reuseUserName?: boolean;
    };
    billingAddress?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zip: string;
    };
    serviceAddress?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
    creditCard?: {
        accountNumber?: number;
        creditCardNumber: number;
    };
}

export interface SimpleAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}

export interface AddressValidation {
    confidenceLevel: 'None' | 'Verified' | 'PremisesPartial' | 'InteractionRequired' | 'StreetPartial' | 'Multiple' | 'BLANK';
    correctedAddress?: SimpleAddress[];
    validationStatus: 'VALID' | 'NOT_VALID';
}

export interface CustomerValidateResponse {
    valid: boolean;
    emailValidation: {
        valid: boolean;
    };
    usernameValidation: {
        valid: boolean;
    };
    billingAddressValidation: AddressValidation;
    serviceAddressValidation?: AddressValidation;
    ccValidation?: {
        valid: boolean;
        prePaidBin?: boolean;
    };
}

export enum AddressCorrectionAction {
    Suggest,
    AutoCorrect,
    VerifyAddress,
}

export interface AvsValidationState {
    billingAddress?: AddressValidationState;
    serviceAddress?: AddressValidationState;
    ccValidation?: {
        valid: boolean;
        prePaidBin?: boolean;
    };
}

export interface AddressValidationState {
    addressCorrectionAction: AddressCorrectionAction;
    validated: boolean;
    correctedAddresses?: AddressValidationStateAddress[];
}

export interface AddressValidationStateAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export interface UserNameValidateResponse {
    valid: boolean;
}

export interface UserNameValidatePayload {
    userName: string;
    accountNumber?: string;
    reuseUserName: true;
}

export interface UserNamePasswordValidatePayload {
    userName: string;
    password: string;
}
