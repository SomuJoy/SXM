import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface UpdateAccountLoginRequest {
    userName: string;
    password: string;
    oldPassword: string;
}

export interface UpdateAccountLoginResponse {
    status: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/account-mgmt/update-account-login';

@Injectable({ providedIn: 'root' })
export class UpdateAccountLoginService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: UpdateAccountLoginRequest): Observable<UpdateAccountLoginResponse> {
        const options = { withCredentials: true };
        return this._post<UpdateAccountLoginRequest, UpdateAccountLoginResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
