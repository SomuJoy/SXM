import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, take, concatMap } from 'rxjs/operators';

import { getApiPrefix, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

export interface DeviceValidateRequestModel {
    radioId?: string;
    vin?: string;
}

export interface DeviceValidateResponseModel {
    validDeviceInfo: RadioModel;
}

export interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
}

export interface RadioModel {
    id?: string;
    last4DigitsOfRadioId: string;
    radioId?: string;
    nickName?: string;
    endDate?: number;
    deviceStatus?: string;
    vehicleInfo: VehicleModel;
    is360LCapable?: boolean;
    last4DigitsOfVin?: string;
}

const ENDPOINT_URL = '/device/validate';

@Injectable({ providedIn: 'root' })
export class DeviceValidateService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    validate(params: DeviceValidateRequestModel, allowErrorHandler: boolean = true): Observable<RadioModel> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => this._http.post<MicroservicesResponse<RadioModel>>(`${url}${ENDPOINT_URL}`, params, options).pipe(map((response) => response.data)))
        );
    }
}
