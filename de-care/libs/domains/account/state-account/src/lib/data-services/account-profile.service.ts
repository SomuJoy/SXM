import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AccountProfileRequest {
    accountNumber?: string;
    radioId?: string;
}

export interface AccountProfileResponse {
    emailOnFile: string;
    isEmailEligibleForUserName: boolean;
}

const ENDPOINT_URL = '/account/registration/account-profile';

@Injectable({ providedIn: 'root' })
export class AccountProfileService {
    private readonly _url: string;

    constructor(private readonly _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getAccountProfile(request: AccountProfileRequest): Observable<AccountProfileResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<AccountProfileResponse>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map((response) => response.data));
    }
}
