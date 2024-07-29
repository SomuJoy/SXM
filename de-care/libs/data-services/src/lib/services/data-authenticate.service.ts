import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { AuthenticateRequest, AuthenticateResponse } from '../models/authenticate.model';
import { HttpClient } from '@angular/common/http';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

@Injectable({ providedIn: 'root' })
export class DataAuthenticateService {
    private url: string;
    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }
    /**
     * @deprecated use DataAuthenticateService in domain @de-care/domains/account/state-login instead
     */
    authenticate(loginInfo: AuthenticateRequest): Observable<AuthenticateResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this.url}${ENDPOINTS_CONSTANTS.AUTHENTICATE_LOGIN}`, loginInfo, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }
}
