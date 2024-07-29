// ===============================================================================
// Models
import { UserModel } from './user.model';
import { SubscriptionModel } from './subscription.model';
import { ClosedDeviceModel } from './closeddevice.model';

export interface NonPiiResponse {
    nonPIIAccount: AccountModel;
    marketingId: string;
    marketingAcctId: string;
}

export interface OemResponse {
    nonPIIAccount: AccountModel;
    marketingId: string;
    marketingAcctId: string;
    region: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface OemRequest {
    accessToken: string;
    refreshToken: string;
}

export interface AccountModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    customerInfo?: UserModel;
    accountProfile: AccountProfile;
    subscriptions: Array<SubscriptionModel>;
    billingSummary: AccountBillingSummary;
    serviceAddress?: AccountServiceAddress;
    closedDevices: Array<ClosedDeviceModel>;
    hasEmailAddressOnFile?: boolean;
    isNewAccount?: boolean;
    useEmailAsUsername?: boolean;
    hasUserCredentials?: boolean;
    subscriptionId?: string; // currently worked on subscription number
    last4DigitsOfAccountNumber?: string;
}

export interface AccountFromTokenModel {
    isUserNameInTokenSameAsAccount?: boolean;
    nonPIIAccount: AccountModel;
    maskedUserNameFromToken?: string;
    marketingId: string;
    marketingAcctId: string;
}

export enum TokenPayloadType {
    SalesAudio = 'SALES_AUDIO',
    SalesStreaming = 'SALES_STREAMING',
    Account = 'ACCOUNT',
}

export interface TokenPayload {
    token: string;
    tokenType: TokenPayloadType;
}

export interface AccountProfile {
    accountRegistered: boolean;
    newRegister: boolean;
}

export interface AccountDataRequest {
    accountNumber?: string;
    radioId?: string;
    vin?: string;
    lastName?: string;
    userName?: string;
    subscriptionId?: string;
    identifiedUser?: boolean;
}

export interface AccountVerify {
    lastName: string;
    phoneNumber: string;
    zipCode: string;
}

export interface AccountBillingSummary {
    creditCard: SavedCC;
}

export interface AccountServiceAddress {
    state: string;
}

export class SavedCC {
    type: string;
    last4Digits: string;
    status: CreditCardStatus;
}

export type CreditCardStatus = 'ACTIVE' | 'EXPIRED' | 'ABOUT_TO_EXPIRE';
