import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/identity/registration/flepz';

export interface RequestModel {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number | string;
    zipCode: string;
}
export interface AccountModel {
    last4DigitsOfAccountNumber: string;
    subscriptions: CustomerAccountsListSubscription[];
}
interface CustomerAccountsListSubscription {
    closed: boolean;
    status: string;
    plans: CustomerAccountsListPlan[];
    followOnPlans: CustomerAccountsListPlan[];
    radioService: CustomerAccountsListRadioService | null;
    streamingService: CustomerAccountsListStreamingService | null;
}

interface CustomerAccountsListPlan {
    code: string;
    packageName: string;
    termLength: number;
    endDate: string;
    type: string;
}

interface CustomerAccountsListRadioService {
    last4DigitsOfRadioId: number;
    vehicleInfo?: {
        model?: string;
        make?: string;
        year?: string;
    };
}

interface CustomerAccountsListStreamingService {
    maskedUserName: string;
    id: string;
    status: string;
    randomCredentials: boolean;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataRegistrationFlepzService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    flepzLookup(payload: RequestModel): Observable<AccountModel[]> {
        return this._post<RequestModel, AccountModel[], ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
