export interface ActivateTrialAccountRequest {
    emailAddressChanged?: boolean;
    subscriptionId?: number;
    radioId?: string | number;
    plans: Plan[];
    followOnPlans?: Plan[];
    paymentInfo?: PaymentInfo;
    billingAddress?: Address;
    serviceAddress?: Address;
    streamingInfo?: StreamingInfo;
    marketingPromoCode?: string;
    languagePreference?: string;
}

export interface Plan {
    planCode: string;
}

export interface CardInfo {
    expiryYearWithPrefix: string;
    cardType: string;
    cardNumber: number;
    dateOfBirth: string;
    expiryMonth: number;
    expiryYear: number;
    nameOnCard: string;
    securityCode: string;
    transactionId: string;
}

export interface PaymentInfo {
    useCardOnfile: boolean;
    paymentType: string;
    cardInfo: CardInfo;
    giftCards: any[];
    paymentAmount: number;
}

export interface Address {
    avsvalidated: boolean;
    addressType?: string;
    streetAddress: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    company?: string;
    specialNotes?: string;
}

export interface StreamingInfo {
    login: string;
    password: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
}
