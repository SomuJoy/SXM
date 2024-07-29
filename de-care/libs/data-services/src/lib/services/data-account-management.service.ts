import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { map } from 'rxjs/operators';
import { AccountManagamentDoNotCallRequestModel, AccountManagementDoNotCallResponseModel } from '../models/account-management.model';

@Injectable({ providedIn: 'root' })
export class DataAccountManagementService {
    private url: string;
    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    donotcall(params: AccountManagamentDoNotCallRequestModel): Observable<AccountManagementDoNotCallResponseModel> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<AccountManagementDoNotCallResponseModel>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_MGMT_PREFERENCES_DONOTCALL}`, params, options)
            .pipe(
                map(response => {
                    return response.data;
                })
            );
    }
}
