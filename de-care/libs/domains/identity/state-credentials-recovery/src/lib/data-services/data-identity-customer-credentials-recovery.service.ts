import { Injectable, Inject } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/identity/customer/credentials-recovery';
interface Request {
    emailOrUsername?: string;
    source?: string;
    accountNumber?: any;
    radioId?: any;
}
interface Response {
    accounts: AccountModel[];
}
export interface AccountModel {
    subscriptions: unknown[];
    accountState: string;
    last4DigitsOfAccountNumber: number;
    // TODO: fill in rest of model
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataIdentityCustomerCredentialsRecoveryService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccount(payload) {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
