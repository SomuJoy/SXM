export enum CreateAccountError {
    'creditCard' = 'creditCard',
    'other' = 'other',
}

interface IngressQueryParams {
    last4digitsOfRadioId: string | null;
    programCode: string | null;
    usedCarBrandingType: string | null;
    redirectURL: string | null;
}

interface UserInfo {
    email: string;
    phoneNumber: string;
}

interface PaymentInfo {
    address: string;
    city: string;
    state: string;
    zip: string;
    ccName: string;
    ccNum: number;
    ccExp: string;
    ccCvv: number;
    serviceAddressSame: boolean;
}

export interface Address {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    address?: string;
    zip?: string;
}

export interface CreateAccountFormData {
    userInfo: UserInfo;
    paymentInfo: PaymentInfo;
    serviceAddress?: Address;
    correctedAddress?: Address;
}

export interface TransactionResultsData {
    isEligibleForRegistration: boolean;
    subscriptionId: number;
    accountNumber: string;
    radioId: string;
}

export interface TrialActivationRtpSharedState {
    queryParams: IngressQueryParams;

    isCreateAccountStepComplete: boolean;

    createAccountSubmissionHasError: boolean;
    createAccountError: CreateAccountError | null;

    createAccountFormData: CreateAccountFormData | null;
    prepaidRedeem: boolean;
    isReviewStepComplete: boolean;
    transactionResultsData: TransactionResultsData | null;
    isMCPFlow: boolean;
    isExtRtcFlow: boolean;
    selectedLeadOfferPlanCode?: string;
    displayNucaptcha: boolean;
    captchaValidationProcessing: boolean;
    transactionId?: string;
}

export const initialState: TrialActivationRtpSharedState = {
    queryParams: {
        last4digitsOfRadioId: null,
        programCode: null,
        usedCarBrandingType: null,
        redirectURL: null,
    },

    isCreateAccountStepComplete: false,

    createAccountSubmissionHasError: false,
    createAccountError: null,

    createAccountFormData: null,
    prepaidRedeem: false,
    isReviewStepComplete: false,
    transactionResultsData: null,
    isMCPFlow: false,
    isExtRtcFlow: false,
    displayNucaptcha: false,
    captchaValidationProcessing: false,
};
