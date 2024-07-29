import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { ActivateTrialAccountRequest } from './activate-trial-account-request.interfaces';
import { ActivateTrialAccountResponse } from './activate-trial-account-response.interfaces';

const ENDPOINT_URL = '/trial-activation/new-account';

@Injectable({ providedIn: 'root' })
export class DataActivateTrialAccountService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    activateTrialAccount(request: ActivateTrialAccountRequest): Observable<ActivateTrialAccountResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<ActivateTrialAccountResponse>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data));
    }
}
