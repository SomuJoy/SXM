import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

export interface TokenUserNameRequest {
    tokenType?: string;
    token?: string;
}

export interface TokenUserNameResponse {
    data: any;
}

const ENDPOINT_URL = '/account/token/username';

@Injectable({ providedIn: 'root' })
export class DataAccountTokenUsernameService extends MicroservicesEndpointService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccountFromToken(token: string): Observable<TokenUserNameResponse> {
        const options = { withCredentials: true };
        return this._post<TokenUserNameRequest, TokenUserNameResponse, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, { token, tokenType: 'ACCOUNT' }, options).pipe(
            map((response) => {
                if (response) {
                    return response;
                } else {
                    throw new HttpErrorResponse({ status: 400, statusText: 'No account found' });
                }
            })
        );
    }
}
