import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

export interface FlepzDataRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface FlepzDataResponse {
    status: string;
    httpStatusCode: number;
    httpStatus: string;
    data: [];
}
const ENDPOINT_URL = '/identity/streaming/flepz';

@Injectable({
    providedIn: 'root'
})
export class FindAccountByFlepzService {
    private readonly _url: string;

    constructor(private readonly _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getSubscription(flepzData: FlepzDataRequest): Observable<FlepzDataResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<FlepzDataResponse>>(`${this._url}${ENDPOINT_URL}`, flepzData, options).pipe(
            map(response => {
                // if (response.data.nonPIIAccount) {
                //     return response.data;
                // } else {
                //     throw new HttpErrorResponse({ status: 400, statusText: 'No account found' });
                // }
                return response.data;
            })
        );
    }
}
