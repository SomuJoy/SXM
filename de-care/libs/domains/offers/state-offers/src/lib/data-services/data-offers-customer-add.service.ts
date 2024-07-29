import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Offer } from './offer.interface';

const ENDPOINT_URL = '/offers/customer/add';

export interface OffersToAddRequest {
    radioId?: string;
}

@Injectable({ providedIn: 'root' })
export class DataOffersCustomerAddService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    offersToAdd(request: OffersToAddRequest = {}) {
        return this._post<OffersToAddRequest, { offers: Offer[]; presentment: any }, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, { withCredentials: true });
    }
}
