export interface Sl2cForm {
    radioIdOrVin: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    accountAddress: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
    };
}
