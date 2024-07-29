export interface UserEnteredCustomerInfo {
    firstName: string;
    lastName: string;
    zipCode: string;
}

export type CustomerPersonalInfo = null | {
    firstName?: string;
    lastName?: string;
    email?: string;
    zipCode?: string;
};

export interface CustomerInfo {
    personalInfo: CustomerPersonalInfo;
}
