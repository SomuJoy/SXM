export interface QuoteRequestModel {
    planCodes: string[];
    renewalPlanCode?: string;
    radioId?: string;
    serviceAddress?: AddressModel;
    subscriptionId?: string;
    followOnPlanCodes?: string[];
}

export interface AddressModel {
    streetAddress?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
