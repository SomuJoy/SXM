import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/trial/sltc-token';

export interface SltcResponse {
    vin: string;
    last4DigitsOfRadioId: string;
}

@Injectable({ providedIn: 'root' })
export class Sl2cTokenService {
    private _url: string;

    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getVinFromSl2cToken(token: string): Observable<SltcResponse> {
        const options = { withCredentials: true };
        return this._http.get<MicroservicesResponse<SltcResponse>>(`${this._url}${ENDPOINT_URL}/${token}`, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }
}
