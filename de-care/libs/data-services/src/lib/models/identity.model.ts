export interface IdentityLookupPhoneOrEmailRequestModel {
    email: string;
}

export enum SubscriptionActionTypeEnum {
    CREATE_LOGIN = 'CREATE_LOGIN',
    SIGN_IN = 'SIGN_IN',
    ADD_SUB = 'ADD_SUB',
}

export interface IdentityLookupPhoneOrEmailResponseModel {
    subActionType: SubscriptionActionTypeEnum;
    status: string;
    id?: string;
    plans: Array<Plan>;
    followonPlans: [];
    radioService: {
        last4DigitsOfRadioId: string;
        vehicleInfo: {
            model: string;
            make: string;
            year: string | number;
        };
    };
    streamingService: {
        status: string;
        randomCredentials: false;
        maskedUserName: string;
    };
}

export interface Plan {
    code: string;
    packageName: string;
    termLength: number;
    endDate: string;
    type: string;
    expired: boolean;
    capabilities: string[];
}

export interface YourSubscriptionOptions {
    currentSubscriptions: IdentityLookupPhoneOrEmailResponseModel[];
    offeredSubscriptions: IdentityLookupPhoneOrEmailResponseModel[];
}

export interface SubscriptionItem {
    subscriptions: IdentityLookupPhoneOrEmailResponseModel[];
    actionType: SubscriptionActionTypeEnum;
}

export interface IdentityFlepzRequestModel {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
    prospectTrial?: boolean;
    optInForNFL?: boolean;
}

/**
 * @deprecated This is now part of LicencePlateLookupService in @de-care/domains/device/state-device-validate
 */
export interface IdentityDeviceLpRequestModel {
    licensePlate: string;
    state: string;
}

/**
 * @deprecated This is now part of LicencePlateLookupService in @de-care/domains/device/state-device-validate
 */
export interface IdentityDeviceLpResponseModel {
    last4DigitsOfVin: string;
}

export interface IdentityRequestModel {
    requestType: string;
    selectedRadio?: string;
    flepzInfo?: IdentityFlepzRequestModel;
    radioId?: string;
    vin?: string;
    licencePlateInfo?: IdentityDeviceLpRequestModel;
}

export interface StudentInfo {
    firstName: string;
    lastName: string;
    email: string;
}

export type NullableStudentInfo = StudentInfo | null;

export enum CheckoutStudentVerificationResolverErrors {
    StudentInfoNotInResponse = 'Student info not present in response',
    InvalidToken = 'Invalid token',
    BackendError = 'Backend error',
}

export interface CheckoutStudentVerification {
    error: boolean;
    errorType: CheckoutStudentVerificationResolverErrors | null;
    studentInfo: NullableStudentInfo;
}
