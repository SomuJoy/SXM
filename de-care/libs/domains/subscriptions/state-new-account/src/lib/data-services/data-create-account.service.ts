import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { CreateAccountRequest } from './create-account-request.interfaces';
import { CreateAccountResponse } from './create-account-response.interfaces';

const ENDPOINT_URL = '/purchase/new-account';

@Injectable({ providedIn: 'root' })
export class DataCreateAccountService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    createAccount(request: CreateAccountRequest): Observable<CreateAccountResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<CreateAccountResponse>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data));
    }
}
