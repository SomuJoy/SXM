import { Account, Subscription, ClosedDeviceModel } from './account.interface';
import { EligibilityStatus } from './data-account-acsc.service';

export interface AccountFromTokenModel {
    isUserNameInTokenSameAsAccount?: boolean;
    nonPIIAccount: Account;
    maskedUserNameFromToken?: string;
    marketingId: string;
    marketingAcctId: string;
    email?: string;
}

export interface AccountFromAcscTokenModel {
    eligibilityStatus: EligibilityStatus;
    trialAccountResponse: {
        nonPIIAccount: Account;
        marketingId: string;
        marketingAcctId: string;
    };
    sCEligibleSelfPaySubscriptions: Subscription[];
    sCEligibleClosedDevices: ClosedDeviceModel[];
    selfPayAccountNumberForACOnly?: string;
    sPEligibleSelfPaySubscriptionIds?: string[];
    sPEligibleClosedRadioIds?: string[];
}
