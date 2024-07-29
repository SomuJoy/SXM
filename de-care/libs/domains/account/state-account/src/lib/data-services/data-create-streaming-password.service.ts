import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/account/prospect/create-streaming-password';

interface Request {
    newPassword: string;
    resetKey?: string;
}
interface Response {
    status: string;
}
type ActionErrorCodes = 'INTERNAL_SERVER_ERROR' | 'HEADER_X_FORWARDED_FOR_REQUIRED' | 'GENERIC_ERROR_CODE' | 'LDAP_FAILURE' | 'INVALID_CHANNEL_LINEUP_ID';
type FieldErrorCodes = 'INVALID_PASSWORD_RESET_TOKEN' | 'EXPIRED_PASSWORD_RESET_TOKEN';

@Injectable({ providedIn: 'root' })
export class DataCreateStreamingPasswordService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    createPassword(payload: Request): Observable<Response> {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
