import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/utility/sal/token';
const ENDPOINT_URL_GET = '/account/sal/token';

interface RequestModel {
    subscriptionId: string;
}

interface ResponseModel {
    token: string;
}

interface TokenRequestModel {
    accountToken?: string;
    deviceToken?: string;
    radioId?: string;
    accountNumber?: string;
    subscriptionId?: string;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataPlayerAppTokenService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getTokenForSubscriptionId(payload: RequestModel): Observable<ResponseModel> {
        return this._post<RequestModel, ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }

    getToken(payload?: TokenRequestModel): Observable<ResponseModel> {
        return this._get<ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL_GET}`, {
            withCredentials: true,
            params: payload ? { ...payload } : {},
        });
    }
}
