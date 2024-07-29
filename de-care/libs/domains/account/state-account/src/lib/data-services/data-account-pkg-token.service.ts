import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';
import { ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { Observable } from 'rxjs';
import { Account } from './account.interface';

const ENDPOINT_URL = '/account/token/pkg-upgrade';

type ActionErrorCodes = '';
type FieldErrorCodes = '';

type DataAccountPKGTokenServiceResponse = {
    nonPIIAccount: Account;
    eligibleSecondarySubscriptions: DataAccountPkgTokenEligibleSubscription[];
};

type DataAccountPkgTokenEligibleSubscription = {
    status: string;
    radioService: {
        last4DigitsOfRadioId: string;
        vehicleInfo?: {
            year: number;
            make: string;
            model: string;
        };
    };
};

@Injectable({ providedIn: 'root' })
export class DataAccountPKGTokenService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccountFromToken(
        token: string,
        isStreaming: boolean = false,
        student: boolean = false,
        allowErrorHandler: boolean = true
    ): Observable<DataAccountPKGTokenServiceResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._post(`${this._apiUrl}${ENDPOINT_URL}`, { token, tokenType: isStreaming ? 'SALES_STREAMING' : 'SALES_AUDIO', student }, options);
    }
}
