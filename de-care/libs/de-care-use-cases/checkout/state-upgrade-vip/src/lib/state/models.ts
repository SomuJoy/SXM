export type DeviceStatus = 'TRIAL' | 'CLOSED' | 'SELF_PAID';

export interface Device {
    radioId?: string;
    vehicle?: {
        year?: number;
        make?: string;
        model?: string;
    };
    status?: DeviceStatus;
    packageName?: string;
}
export interface Streaming {
    id?: string;
    userName?: string;
    maskedUserName?: string;
    password?: string;
    status?: string;
    randomCredentials?: boolean;
    packageName?: string;
}

export interface DeviceType {
    device?: Device;
    streaming?: Streaming;
    isJustFound?: boolean;
}

export interface PaymentInfo {
    billingAddress: PaymentAddress;
    ccExpDate: string;
    ccName: string;
    ccNum: string;
}

export interface PaymentAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    country?: 'us' | 'ca';
    avsValidated?: boolean;
}

export enum DeviceCredentialsStatus {
    EligibleForRegistration = 'eligible_for_registration',
    EligibleForStreamingCredentialsOnly = 'eligible_for_streaming_credentials_only',
    AlreadyRegistered = 'already_registered',
}
