import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { ALLOW_ERROR_HANDLER_HEADER, getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/identity/device/license-plate';

export interface IdentityDeviceLpRequestModel {
    licensePlate: string;
    state: string;
}

export interface IdentityDeviceLpResponseModel {
    last4DigitsOfVin: string;
}

@Injectable({ providedIn: 'root' })
export class LicencePlateLookupService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    // NOTE: allowErrorHandler is set to false right now since this endpoint returns a 500 when license plate is not found.
    //       (we would change this back to true once the endpoint is updated to not return a 500 in the not found scenario)
    validate(params: IdentityDeviceLpRequestModel, allowErrorHandler: boolean = false): Observable<IdentityDeviceLpResponseModel> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
            }
        };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url =>
                this._http.post<MicroservicesResponse<IdentityDeviceLpResponseModel>>(`${url}${ENDPOINT_URL}`, params, options).pipe(
                    map(response => response.data),
                    // NOTE: temp logic to identify not found scenario when endpoint is actually returning a 500 error
                    //       (we would remove this once the endpoint is updated to not return a 500 in the not found scenario)
                    catchError(error => {
                        if (error?.status === 500 && error?.error?.error?.errorStackTrace?.toLowerCase().indexOf('data not found in simulator') >= 0) {
                            return throwError('License plate data not found');
                        } else {
                            return throwError(error);
                        }
                    })
                )
            )
        );
    }
}
