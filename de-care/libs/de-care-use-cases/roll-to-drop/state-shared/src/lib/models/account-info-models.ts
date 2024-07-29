import { RTDAddress } from './payment-info-models';

export interface RTDAccountInfo {
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    email: string;
    country: string;
    serviceAddress: RTDAddress;
}
