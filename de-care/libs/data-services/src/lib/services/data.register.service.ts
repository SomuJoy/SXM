import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { RegisterDataModel, RegisterResponseDataModel } from '../models/register.model';
import { Observable } from 'rxjs';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

@Injectable({ providedIn: 'root' })
export class DataRegisterService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    registerAccount(registerData: RegisterDataModel): Observable<RegisterResponseDataModel> {
        return this._http
            .post<MicroservicesResponse<RegisterResponseDataModel>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_REGISTER}`, registerData, { withCredentials: true })
            .pipe(
                map((response: MicroservicesResponse<RegisterResponseDataModel>) => {
                    return response.data;
                })
            );
    }
}
