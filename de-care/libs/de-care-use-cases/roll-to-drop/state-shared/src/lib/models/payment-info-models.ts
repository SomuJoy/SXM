export interface RTDPaymentInfo {
    billingAddress: RTDAddress;
    ccExpDate: string;
    ccName: string;
    ccNum: string;
    transactionId?: string;
    securityCode?: string;
}

export interface RTDAddress {
    addressLine1?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    avsvalidated?: boolean;
}
