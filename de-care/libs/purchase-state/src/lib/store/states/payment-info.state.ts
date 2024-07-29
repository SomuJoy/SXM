export interface PaymentInfo {
    useSavedCard: boolean;
    ccError: boolean;
    name: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    CVV: string;
    transactionId: string;
    resetTransactionId: boolean;
    billingAddress: PaymentInfoAddress;
    serviceAddress?: PaymentInfoAddress;
    flep: Flep;
    email: string;
    password: string;
    passwordInvalidError: boolean;
    passwordContainsPiiDataError: boolean;
}

export interface Flep {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface PaymentInfoAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
    filled: boolean;
    avsvalidated: boolean;
}

export const initialPaymentInfoState: PaymentInfo = {
    useSavedCard: null,
    ccError: false,
    name: null,
    cardNumber: null,
    expireMonth: null,
    expireYear: null,
    CVV: null,
    transactionId: null,
    resetTransactionId: false,
    billingAddress: {
        addressLine1: null,
        city: null,
        state: null,
        zip: null,
        filled: false,
        avsvalidated: false,
    },
    serviceAddress: {
        addressLine1: null,
        city: null,
        state: null,
        zip: null,
        filled: false,
        avsvalidated: false,
    },
    flep: null,
    email: null,
    password: null,
    passwordInvalidError: false,
    passwordContainsPiiDataError: false,
};
