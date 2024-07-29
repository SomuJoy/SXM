export interface BillingAddress {
    email: string;
    avsvalidated: boolean;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
