import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountFromTokenModel } from './account-from-token.interface';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/account/token';

@Injectable({ providedIn: 'root' })
export class DataAccountTokenService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getAccountFromToken(
        token: string,
        isStreaming: boolean,
        student: boolean = false,
        allowErrorHandler: boolean = true,
        tokenType: string
    ): Observable<AccountFromTokenModel> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http.post<MicroservicesResponse<AccountFromTokenModel>>(`${this._url}${ENDPOINT_URL}`, { token, tokenType, student }, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
