import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface UpdateAccountBillingAddressRequest {
    billingAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zipCode: string | number;
    };
}

export interface UpdateAccountBillingAddressResponse {
    status: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';
const ENDPOINT_URL = '/account-mgmt/update-billing-info';

@Injectable({ providedIn: 'root' })
export class UpdateAccountBillingAddressService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: UpdateAccountBillingAddressRequest): Observable<UpdateAccountBillingAddressResponse> {
        const options = { withCredentials: true };
        return this._post<UpdateAccountBillingAddressRequest, UpdateAccountBillingAddressResponse, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            request,
            options
        );
    }
}
