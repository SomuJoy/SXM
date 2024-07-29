import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from './account.interface';
import { RegisterDataModel, RegisterResponseDataModel } from './registration.interface';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

export interface AccountRequest {
    accountNumber?: string;
}

const ENDPOINT_URL = '/account';
const ACCOUNT_REGISTER_URL = '/account/register';

@Injectable({ providedIn: 'root' })
export class DataAccountService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccount(request: AccountRequest): Observable<Account> {
        const options = { withCredentials: true };
        return this._post<AccountRequest, Account, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }

    registerAccount(registerData: RegisterDataModel): Observable<RegisterResponseDataModel> {
        return this._post<RegisterDataModel, RegisterResponseDataModel, null, null>(`${this._apiUrl}${ACCOUNT_REGISTER_URL}`, registerData, { withCredentials: true });
    }
}
