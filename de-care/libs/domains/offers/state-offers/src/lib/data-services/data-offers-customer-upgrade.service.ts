import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offer.interface';

const ENDPOINT_URL = '/offers/customer/upgrade';

interface Request {
    subscriptionId: string;
}
interface Response {
    offers: Offer[];
    presentment: string;
    digitalSegment: string;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataOffersCustomerUpgradeService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getCustomerUpgradeOffers(payload: Request): Observable<Response> {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
