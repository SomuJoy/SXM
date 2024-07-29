import { Injectable, Inject } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/account/credential-recovery/password/send-email';

interface Request {
    accountLoginCredentials?: boolean;
    setResetKey?: boolean;
    subscriptionId: number;
    queryParam?: string;
    langPref?: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromEmailService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccount(payload) {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
