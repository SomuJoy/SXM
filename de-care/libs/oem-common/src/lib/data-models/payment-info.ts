export interface PaymentInfo {
    nameOnCard: string;
    cardNumber: number;
    expiryMonth: string;
    expiryYear: string;
    securityCode?: string;
}
