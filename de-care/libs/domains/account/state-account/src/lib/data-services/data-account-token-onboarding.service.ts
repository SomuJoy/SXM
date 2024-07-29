import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { AccountFromTokenModel } from './account-from-token.interface';

const ENDPOINT_URL = '/account/token/onboarding';

type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataAccountTokenOnboardingService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccountFromToken(token: string, allowErrorHandler: boolean = true, tokenType?: string): Observable<AccountFromTokenModel> {
        return this._post<{ token: string; tokenType?: string }, AccountFromTokenModel, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            { token, tokenType },
            {
                withCredentials: true,
                headers: {
                    'X-Allow-Error-Handler': allowErrorHandler.toString(),
                },
            }
        );
    }

    getAlcCodeFromAccountToken(token: string): Observable<{ alcCode: string }> {
        return this._post<{ token: string; tokenType: string }, { alcCode: string }, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            { token, tokenType: 'INSTANT_STREAM' },
            {
                withCredentials: true,
                headers: {
                    'X-Allow-Error-Handler': 'true',
                },
            }
        );
    }
}
