import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { AccountFromTokenModel } from './account-from-token.interface';

const ENDPOINT_URL = '/account/token';

export type AccountTokenType = 'SALES_STREAMING' | 'SALES_AUDIO' | 'ACCOUNT';

export type AccountTokenWithTypeRequest = {
    token: string;
    tokenType: AccountTokenType;
    student: boolean;
};

@Injectable({ providedIn: 'root' })
export class AccountTokenWithTypeService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccountFromToken(request: AccountTokenWithTypeRequest) {
        const options = {
            withCredentials: true,
        };
        return this._post<AccountTokenWithTypeRequest, AccountFromTokenModel, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
