import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SweepstakesRequest, SweepstakesResponse, SweepstakesSubmitStatus } from '../models/account-mgmt.model';
import { mapTo, catchError } from 'rxjs/operators';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { SettingsService } from '@de-care/settings';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

@Injectable({ providedIn: 'root' })
export class DataSweepstakesService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    sweepstakesRegister(data: SweepstakesRequest): Observable<SweepstakesResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<SweepstakesResponse>>(`${this.url}${ENDPOINTS_CONSTANTS.ACCOUNT_MGMT_SWEEPSTAKES}`, data, options).pipe(
            mapTo({ status: SweepstakesSubmitStatus.SUCCESS }),
            catchError(err => {
                if ((err.status = 400 && err.error.error.fieldErrors && err.error.error.fieldErrors.length > 0)) {
                    switch (err.error.error.fieldErrors[0].errorCode) {
                        case 'DUPLICATE_EMAIL':
                            return of({ status: SweepstakesSubmitStatus.DUPLICATE_EMAIL });
                        case 'INVALID_DOB':
                            return of({ status: SweepstakesSubmitStatus.INVALID_DOB });
                        default:
                            return of({ status: SweepstakesSubmitStatus.ERROR });
                    }
                } else {
                    //TODO: Consider to use another way to handle errors. Check CoreLoggerService and sweepstakes module hierarchy issues.
                    console.error(err.error);
                }
            })
        );
    }
}
