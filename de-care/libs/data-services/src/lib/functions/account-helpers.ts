import { SubscriptionModel, SubscriptionStreamingService } from '../models/subscription.model';
import { ClosedDeviceModel } from '../models/closeddevice.model';
import { AccountModel } from '../models/account.model';
import { VehicleModel } from '../models/vehicle.model';
import { PlanModel } from '../models/plan.model';
import { Account } from '@de-care/domains/account/state-account';

export function getRadioIdFromAccount(account: AccountModel) {
    if (!account) {
        return null;
    }
    if (account.subscriptions && account.subscriptions.length > 0) {
        return account.subscriptions[0].radioService ? account.subscriptions[0].radioService.last4DigitsOfRadioId : null;
    } else if (account.closedDevices && account.closedDevices.length > 0) {
        return account.closedDevices[0].last4DigitsOfRadioId;
    } else {
        return null;
    }
}

export function getRadioServiceFromAccount(account: AccountModel | Account) {
    if (!account) {
        return null;
    }
    if (account.subscriptions && account.subscriptions.length > 0) {
        return account.subscriptions[0].radioService;
    } else {
        return null;
    }
}

export function getStateFromAccount(account: AccountModel) {
    return account && account.serviceAddress && account.serviceAddress.state;
}

export function getVehicleOnAccount(account: AccountModel): VehicleModel | null {
    if (!account) {
        return null;
    }
    if (account.subscriptions && account.subscriptions.length > 0 && account.subscriptions[0].radioService) {
        return account.subscriptions[0].radioService.vehicleInfo;
    } else if (account.closedDevices && account.closedDevices.length > 0) {
        return account.closedDevices[0].vehicleInfo;
    } else {
        return null;
    }
}

export function getActivePlansOnAccount(account: AccountModel): PlanModel[] | null {
    if (!account) {
        return null;
    }
    return account.subscriptions && account.subscriptions.length > 0 ? account.subscriptions[0].plans : null;
}

export function getSubscriptionIdFromAccount(account: AccountModel): string | null {
    if (!account) {
        return null;
    }
    return account.subscriptions && account.subscriptions.length > 0 && account.subscriptions[0].id;
}

export function getSubscriptionIdFromClosedDevice(account: AccountModel): string | null {
    if (!account) {
        return null;
    }
    return account.closedDevices && account.closedDevices.length > 0 ? account.closedDevices[0].subscription?.id : null;
}

export function getMaskedUserNameFromAccount(account: AccountModel): string | null {
    if (!account) {
        return null;
    }
    const subscription = account.subscriptions[0];
    return account.subscriptions && subscription && subscription.streamingService && subscription.streamingService.maskedUserName;
}

export function getFirstSubscriptionOrClosedDeviceStatus(account: AccountModel, radioId?: string): string {
    if (account && !account.subscriptions && !account.closedDevices) {
        return '';
    }
    const matchingSubs: SubscriptionModel[] = !radioId
        ? account.subscriptions || []
        : (account.subscriptions || []).filter((item: SubscriptionModel) => item.radioService && item.radioService.last4DigitsOfRadioId === radioId);

    if (matchingSubs.length > 0) {
        return matchingSubs[0].status;
    } else {
        const matchingClosed: ClosedDeviceModel[] = !radioId
            ? account.closedDevices || []
            : (account.closedDevices || []).filter((item: ClosedDeviceModel) => item.last4DigitsOfRadioId && item.last4DigitsOfRadioId === radioId);
        if (matchingClosed.length > 0) {
            return matchingClosed[0].subscription.status;
        } else {
            return '';
        }
    }
}

export function getFirstSubscriptionOrClosedDeviceWithStreaming(account: AccountModel): SubscriptionStreamingService {
    if (account && !account.subscriptions && !account.closedDevices) {
        return null;
    }
    const matchingSubs: SubscriptionModel[] = (account.subscriptions || []).filter((item: SubscriptionModel) => !!item.streamingService);

    if (matchingSubs.length > 0) {
        return matchingSubs[0].streamingService;
    } else {
        const matchingClosed: ClosedDeviceModel[] = (account.closedDevices || []).filter((item: ClosedDeviceModel) => !!item.subscription.streamingService);
        return matchingClosed.length > 0 ? matchingClosed[0].subscription.streamingService : null;
    }
}

export function normalizeAccountNumber(accountNumber: string): string {
    if (accountNumber) {
        return accountNumber.replace(/[^0-9]+/, '');
    }
    return null;
}

export function convertAccountToAccountModel(nonPIIAccount: any) {
    const accountRegistered = nonPIIAccount.accountProfile.accountRegistered;
    const savedCC = nonPIIAccount.billingSummary.creditCard
        ? {
              type: nonPIIAccount.billingSummary.creditCard.type,
              last4Digits: nonPIIAccount.billingSummary.creditCard.last4Digits,
              status: nonPIIAccount.billingSummary.creditCard.status,
          }
        : null;
    const emptyAccount = generateEmptyAccount();
    emptyAccount.firstName = nonPIIAccount.firstName;
    emptyAccount.lastName = nonPIIAccount.lastName;
    emptyAccount.email = nonPIIAccount.email;
    emptyAccount.accountProfile = { accountRegistered, newRegister: false };
    emptyAccount.billingSummary = { creditCard: savedCC };
    emptyAccount.isNewAccount = false;
    emptyAccount.customerInfo = { firstName: nonPIIAccount.firstName, email: nonPIIAccount.email };
    emptyAccount.hasEmailAddressOnFile = nonPIIAccount.hasEmailAddressOnFile;
    emptyAccount.subscriptions = nonPIIAccount.subscriptions;
    return emptyAccount;
}

export function generateEmptyAccount(): AccountModel {
    return <AccountModel>{
        customerInfo: { firstName: '', email: '' },
        accountProfile: { accountRegistered: false, newRegister: false },
        subscriptions: [],
        billingSummary: {
            creditCard: null,
        },
        closedDevices: [],
        isNewAccount: true,
    };
}

export function hasOnlyDataTrial(account: AccountModel): boolean {
    const plans = getActivePlansOnAccount(account);
    return plans && plans.find((p) => p.type === 'TRIAL' && !p.dataCapable) ? false : true;
}

export function getStateForServiceAddress(account: AccountModel): string | null {
    return account?.serviceAddress?.state;
}
