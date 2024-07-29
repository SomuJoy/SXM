import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Account } from './account.interface';

export interface NonPiiRequest {
    accountNumber?: string;
    radioId?: string;
    vin?: string;
    lastName?: string;
    userName?: string;
    subscriptionId?: string;
    identifiedUser?: boolean;
}
export interface NonPiiResponse {
    nonPIIAccount: Account;
    marketingId: string;
    marketingAcctId: string;
    email: string;
    maskedUserNameFromToken?: string;
}

const ENDPOINT_URL = '/account/non-pii';

@Injectable({ providedIn: 'root' })
export class DataAccountNonPiiService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    /**
     * @deprecated This method is checking the response model and throwing a custom error.
     * Ideally we would want to have the workflows contain this logic.
     */
    getAccount(accountData: NonPiiRequest): Observable<NonPiiResponse> {
        const options = { withCredentials: true };
        return this._post<NonPiiRequest, NonPiiResponse, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, accountData, options).pipe(
            map((response) => {
                if (response.nonPIIAccount) {
                    return response;
                } else {
                    throw new HttpErrorResponse({ status: 400, statusText: 'No account found' });
                }
            })
        );
    }

    getAccountNonPii(accountData: NonPiiRequest): Observable<NonPiiResponse> {
        const options = { withCredentials: true };
        return this._post<NonPiiRequest, NonPiiResponse, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, accountData, options).pipe(map((response) => response));
    }
}
