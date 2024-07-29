import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { EnvironmentInfoModel } from './environment-info.interface';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/utility/env-info';

@Injectable({ providedIn: 'root' })
export class DataEnvironmentInfoService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getEnvironmentInfo(): Observable<EnvironmentInfoModel> {
        return this._http
            .get<MicroservicesResponse<EnvironmentInfoModel>>(`${this._url}${ENDPOINT_URL}`, { withCredentials: true })
            .pipe(
                map(response => {
                    return response.data;
                })
            );
    }
}
