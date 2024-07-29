import { AddressValidationState, SecurityQuestionsModel } from '@de-care/data-services';

export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface APICallStatus {
    inProgress: boolean;
    hasError: boolean;
}

export interface VerificationOptions {
    maskedPhoneNumber?: string;
    canUsePhone: boolean;
    canUseRadioId: boolean;
    canUseActNumber: boolean;
}

export interface VerificationMethodStatus {
    eligible: boolean;
    verified: boolean;
}

export interface VerificationMethods {
    phone: VerificationMethodStatus;
    radioId: VerificationMethodStatus;
    accountNumber: VerificationMethodStatus;
}

export interface CNAFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // not camel case, for api
    avsvalidated: boolean;
    serviceAddress: boolean;
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export enum CredentialsNeededType {
    usernameAndPassword = 'usernameAndPassword',
    password = 'password',
    none = 'none',
}

export interface RegistrationDataStillNeeded {
    email: boolean;
    phoneNumber: boolean;
    securityQuestions: boolean;
    loginCredentials: CredentialsNeededType;
}

export interface LookupErrors {
    noAccountFoundForAccountNumber: boolean;
    demoAccountFoundAndRadioIsNotBrandedWithTrial: boolean;
    accountFoundCannotBeVerified: boolean;
    radioIDInvalid: boolean;
}

export interface RegistrationErrors {
    userNameError?: boolean;
    systemError?: boolean;
    passwordInvalid?: boolean;
    passwordContainsPiiData?: boolean;
}

export type LookupStatus = 'In Progress' | 'Loading' | 'Complete';
export type CNAStatus = LookupStatus;

export interface RegistrationState {
    flepzData: FlepzData | null;
    userName: string;
    firstName: string;
    email: string;
    isEmailEligibleForUserName: boolean;
    maskedPhoneNumber: string | null;
    last4DgititsSelectedRadioId: string | null;
    hasPhoneNumberOnFile: boolean;
    hasEmailAddressOnFile: boolean;
    systemErrorInFlepz: boolean;
    invalidPhoneInFlepz: boolean;
    flepzSubmissionStatus: APICallStatus;
    verificationOptionsStatus: APICallStatus;
    verificationMethods: VerificationMethods;
    lookupErrors: LookupErrors;
    isInPreTrial: boolean;
    accountRegistered: boolean;
    last4DigitsOfAccountNumber: string;
    invalidRadioIdLookup: boolean;
    invalidAccountNumberLookup: boolean;
    lookupStatus: LookupStatus;
    CNAStatus: CNAStatus;
    CNAFormData: CNAFormData;
    securityQuestions: SecurityQuestionsModel[];
    CNAFormValidationError: AddressValidationState;
    isInStepUpFlow: boolean;
    lookupFormRadioId: string;
    lookupFormAccountNumber: string;
    accountNotFoundLinkClick: boolean;
    registrationDataReady: boolean;
    userBehaviorPayload: string;
    registrationSubmissionErrorStatus: RegistrationErrors;
}
