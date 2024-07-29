export interface CreateAccountRequest {
    emailAddressChanged?: boolean;
    subscriptionId?: number;
    radioId?: string;
    plans: Plan[];
    followOnPlans: Plan[];
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
    nameOnCard: string;
    cardNumber: number;
    expiryMonth: number;
    expiryYear: number;
    expiryYearWithPrefix?: string;
    cardType?: string;
    dateOfBirth?: string;
    securityCode?: string;
}

export interface PaymentInfo {
    useCardOnfile: boolean;
    paymentType: string;
    cardInfo: CardInfo;
    giftCards?: any[];
    paymentAmount?: number;
    transactionId?: string;
}

export interface Address {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    avsvalidated?: boolean;
    addressType?: string;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    phone?: string;
    email?: string;
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
