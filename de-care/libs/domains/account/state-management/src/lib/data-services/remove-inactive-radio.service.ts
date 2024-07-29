import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface RemoveInactiveRadioRequest {
    radioId: string;
    reason: string;
}

export interface RemoveInactiveRadioResponse {
    status: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/account-mgmt/remove-device';

@Injectable({ providedIn: 'root' })
export class RemoveInactiveRadioService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: RemoveInactiveRadioRequest): Observable<RemoveInactiveRadioResponse> {
        const options = { withCredentials: true };
        return this._post<RemoveInactiveRadioRequest, RemoveInactiveRadioResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
