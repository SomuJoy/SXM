import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CustomerSessionInfoModel {
    firstName: string | null;
    lastName: string | null;
    zipCode: string | null;
    email: string | null;
    phoneNumber: string | null;
    radioIdOrVIN: string | null;
}

const ENDPOINT_URL = '/account/customer-info';

@Injectable({ providedIn: 'root' })
export class DataAccountSessionInfoService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getCustomerDataFromSession(): Observable<CustomerSessionInfoModel> {
        const options = { withCredentials: true };
        return this._http.get<MicroservicesResponse<CustomerSessionInfoModel>>(`${this._url}${ENDPOINT_URL}`, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
