import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/account/prospect/create-streaming-trial';

interface Request {
    email: string;
    promoCode: string;
}
interface Response {
    status: string;
}
type ActionErrorCodes = 'INTERNAL_SERVER_ERROR' | 'HEADER_X_FORWARDED_FOR_REQUIRED' | 'GENERIC_ERROR_CODE' | 'LDAP_FAILURE' | 'INVALID_CHANNEL_LINEUP_ID';
type FieldErrorCodes =
    | 'PROSPECT_ACCOUNT_INVALID_EMAIL'
    | 'PROSPECT_ACCOUNT_EXPIRED'
    | 'PROSPECT_ACCOUNT_EXISTS'
    | 'PROSPECT_ACCOUNT_INVALID_USERNAME_OR_PASSWORD'
    | 'PROSPECT_ACCOUNT_INVALID_ZIP_CODE'
    | 'PROSPECT_ACCOUNT_INVALID_PHONE_NUMBER'
    | 'PROSPECT_ACCOUNT_INVALID_PROMO_CODE'
    | 'PROSPECT_ACCOUNT_INACTIVE'
    | 'PROSPECT_ACCOUNT_CLOSED';

@Injectable({ providedIn: 'root' })
export class DataCreateStreamingTrialService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    createTrial(payload: Request): Observable<Response> {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
