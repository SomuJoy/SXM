import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { RefreshRequestInterface } from './refresh-request.interface';
import { RefreshServiceResponse } from './refresh-service-response.interface';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const DEVICE_REFRESH_INSTRUCTION = '/device/send-refresh-instruction';
const DEVICE_REFRESH = '/device/refresh';

@Injectable({
    providedIn: 'root'
})
export class DataDevicesService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    refresh(params: RefreshRequestInterface): Observable<boolean> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<RefreshServiceResponse>>(`${this.url}${DEVICE_REFRESH}`, params, options).pipe(
            map(({ data }) => {
                return data?.status === 'SUCCESS';
            })
        );
    }

    sendRefreshInstruction(params: RefreshRequestInterface): Observable<boolean> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<RefreshServiceResponse>>(`${this.url}${DEVICE_REFRESH_INSTRUCTION}`, params, options).pipe(
            map(({ data }) => {
                return data?.status === 'SUCCESS';
            })
        );
    }
}
