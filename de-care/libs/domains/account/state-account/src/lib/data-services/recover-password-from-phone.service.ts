import { Injectable, Inject } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/account/credential-recovery/password/send-text';

interface Request {
    accountLoginCredentials?: boolean;
    setResetKey?: boolean;
    phoneNo: number;
    sxmUsername?: string;
    langPref?: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromPhoneService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccount(payload) {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}