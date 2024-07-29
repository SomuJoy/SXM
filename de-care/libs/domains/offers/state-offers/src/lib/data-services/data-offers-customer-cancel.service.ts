import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from './offer.interface';
import { catchErrorMapToCustomErrors } from '@de-care/shared/de-microservices-common';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

interface Request {
    streaming?: boolean;
    subscriptionId: number;
    student?: boolean;
    programCode?: string;
    cancelReason: string;
}

interface Response {
    offers: Offer[];
    presentment: PresentmentOffer[];
    digitalSegment: string;
    presentmentTestCell: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

interface PresentmentOffer {
    planCodes: string[];
    type: string;
}

const ENDPOINT_URL = '/offers/customer/cancel';

@Injectable({ providedIn: 'root' })
export class DataOffersCustomerCancelService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getCustomerOffers(payload: Request): Observable<Response> {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true }).pipe(
            catchErrorMapToCustomErrors()
        );
    }
}
