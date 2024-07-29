import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface AuthenticateRequest {
    token: {
        password: string;
        username: string;
        refresh_token?: string;
    };
    environmentData?: {
        userBehaviorPayload: string;
    };
    client?: string;
}

export interface AuthenticateResponse {
    accountNum: string;
    refreshToken: string;
    accessToken: string;
    thirdPartyPartnerName: string;
    thirdPartyPartnerType: string;
}
export interface LogoutRequest {
    source: 'OAC' | 'PHX';
}

type ActionErrorCodes = '';
type FieldErrorCodes = 'CAPTCHA_ANSWER_INCORRECT' | 'CAPTCHA_ANSWER_MISSING' | 'CAPTCHA_TOKEN_MISSING';

const ENDPOINT_URL_LOGIN = '/authenticate/login';
const ENDPOINT_URL_LOGOUT = '/authenticate/logout';

@Injectable({ providedIn: 'root' })
export class DataAuthenticateService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    authenticate(loginInfo: AuthenticateRequest): Observable<AuthenticateResponse> {
        return this._post<AuthenticateRequest, AuthenticateResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL_LOGIN}`, loginInfo, {
            withCredentials: true,
        });
    }

    logout(request: LogoutRequest): Observable<boolean> {
        return this._post<LogoutRequest, boolean, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL_LOGOUT}`, request, { withCredentials: true });
    }
}
