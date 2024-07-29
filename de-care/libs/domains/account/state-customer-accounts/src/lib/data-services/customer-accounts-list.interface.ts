export interface CustomerAccountsListModel {
    accounts: CustomerAccountListAccount[];
}

export interface CustomerAccountListAccount {
    last4DigitsOfAccountNumber: string;
    subscriptions: CustomerAccountsListSubscription[];
}

export interface CustomerAccountsListSubscription {
    closed: boolean;
    status: string;
    plans: CustomerAccountsListPlan[];
    followOnPlans: CustomerAccountsListPlan[];
    radioService: CustomerAccountsListRadioService | null;
    streamingService: CustomerAccountsListStreamingService | null;
}

export interface CustomerAccountsListPlan {
    code: string;
    packageName: string;
    termLength: number;
    endDate: string;
    type: string;
}

export interface CustomerAccountsListRadioService {
    last4DigitsOfRadioId: number;
    vehicleInfo?: {
        model?: string;
        make?: string;
        year?: string;
    };
}

export interface CustomerAccountsListStreamingService {
    maskedUserName: string;
    id: string;
    status: string;
    randomCredentials: boolean;
}

export interface CustomerAccountsListRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number | string;
    zipCode: string;
}
