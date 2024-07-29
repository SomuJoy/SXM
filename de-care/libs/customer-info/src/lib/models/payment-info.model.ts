export interface PaymentInfoOutput {
    paymentForm: PaymentForm;
    useCardOnFile: boolean;
    useInvoice?: boolean;
}
export interface PaymentForm {
    billingAddress: PaymentFormAddress;
    serviceAddress: PaymentFormAddress;
    ccExpDate: string;
    ccName: string;
    ccNum: string;
    flep?: PaymentFormFlep;
}

export interface PaymentFormAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export interface PaymentFormFlep {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
