export interface Account {
    mrdCapable: boolean;
    accountNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    userName: string;
    email: string;
    accountProfile: AccountProfile;
    serviceAddress: Address;
    billingAddress: Address;
    subscriptions: Subscription[];
    billingSummary: BillingSummary;
    consolidatedAccountNumbers: any[];
    closedDevicesMap: any;
    closedDevices: ClosedDeviceModel[];
    hasEmailAddressOnFile?: boolean;
    accountState: { isInPreTrial: boolean };
    hasUserCredentials?: boolean;
    useEmailAsUsername?: boolean;
    maskedEmail?: string;
}

export interface AccountProfile {
    profileNumber: string;
    billingStatus: string;
    accountRegistered: boolean;
    createdOnDate: Date;
}

export interface Address {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isAVSValidated: boolean;
}

export interface Plan {
    code: string;
    label?: string;
    packageName: string;
    termLength: number;
    startDate: Date;
    endDate: Date;
    nextCycleOn?: any;
    marketType: string;
    type: string;
    status: string;
    capabilities: string[];
    isChangePlanAllowed: boolean;
    price: number;
    isBasePlan?: boolean;
    dataCapable?: boolean;
    isPreTiering?: boolean;
    parentPackageName?: string;
    minimumFollowOnTerm?: number;
    product?: string;
    isFamiliyDiscountApplied?: boolean;
    isLifetime?: boolean;
    hasStreamingService?: boolean;
    priceChangeMessagingType?: string;
    priceIncreaseDiff?: number;
}

export interface VehicleInfo {
    year?: any;
    make?: any;
    model?: any;
}

export interface RadioService {
    id: string;
    status: string;
    radioId: string;
    last4DigitsOfRadioId: string;
    vehicleInfo: VehicleInfo;
    capabilities: string[];
    is360LCapable: boolean;
    devicePromoCode: string;
}

export interface StreamingService {
    id: string;
    userName: string;
    status: string;
    randomCredentials: boolean;
    maskedUserName?: string;
    systemGeneratedLogin?: boolean;
    validUserName?: boolean;
}

export interface Subscription {
    id: string;
    status: string;
    plans: Plan[];
    followonPlans: Plan[];
    radioService: RadioService;
    streamingService: StreamingService;
    isMrdDriving: boolean;
    isPrimary: boolean;
    devicePromoCode?: string;
    isDataOnly?: boolean;
    statusCode?: boolean;
    isEligible?: boolean;
    hasOACCredentials?: boolean;
    eligibleSubscriptionId?: string;
    ineligibleReasonCodes?: string[];
    eligibleService?: 'SXIR_STANDALONE' | 'SXIR_LINKED';
    deviceToken?: string;
    createdOnDate?: Date;
    isClosed?: boolean;
    nickname?: string;
    hasMarinePlan?: boolean;
    hasAviationPlan?: boolean;
    hasInactiveServiceDueToSuspension?: boolean;
    hasInactiveServiceDueToNonPay?: boolean;
    hasDuplicateVehicleInfo?: boolean;
}

export interface CreditCard {
    last4Digits: string;
    type: string;
    expiryMonth: number;
    expiryYear: number;
    status: string;
}

export interface BillingSummary {
    creditCard: CreditCard;
    isPaymentTypeInvoice: boolean;
    paymentType?: string;
    amountDue?: number;
    lastPaymentAmount?: number;
    lastPaymentDate?: string;
    nextPaymentAmount?: number;
    nextPaymentDate?: string;
    isAccountInCollection?: boolean;
    isEBill?: boolean;
}
export interface ClosedDeviceModel {
    last4DigitsOfRadioId: string;
    closedDate: string;
    vehicleInfo: VehicleInfo;
    subscription: Subscription;
    devicePromoCode?: string;
    radioId?: string;
    nickname?: string;
    hasDuplicateVehicleInfo?: string;
}
