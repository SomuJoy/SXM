import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/validate/customer-info';
interface Request {
    verifyThirdParty?: boolean;
    email?: {
        email: string;
        streaming?: boolean;
    };
    username?: {
        userName: string;
        accountNumber?: string;
        reuseUserName?: boolean;
    };
    billingAddress?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zip: string;
    };
    serviceAddress?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zip: string;
    };
    creditCard?: {
        accountNumber?: number;
        creditCardNumber: number;
    };
}
interface Response {
    valid: boolean;
    emailValidation: {
        valid: boolean;
    };
    usernameValidation: {
        valid: boolean;
    };
    billingAddressValidation: AddressValidation;
    serviceAddressValidation?: AddressValidation;
    ccValidation?: {
        valid: boolean;
    };
}
interface AddressValidation {
    confidenceLevel: 'None' | 'Verified' | 'PremisesPartial' | 'InteractionRequired' | 'StreetPartial' | 'Multiple' | 'BLANK';
    correctedAddress?: SimpleAddress[];
    validationStatus: 'VALID' | 'NOT_VALID';
}
interface SimpleAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class CustomerInfoValidationService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    validate(request: Request) {
        const options = { withCredentials: true };
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
