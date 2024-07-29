import { getApiPrefix } from '@de-care/settings';
import { Store, select } from '@ngrx/store';
import { map, take, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface DeviceInfoRequestModel {
    radioId: string;
}

export interface DeviceInfoModelResponse {
    deviceInformation: DeviceInfoModel;
}

export interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
}

interface DeviceInfoModel {
    radioId: string;
    deviceStatus: string;
    primaryBrandId?: string;
    primaryDealerId?: string;
    secondaryBrandId?: string;
    secondaryDealerId?: string;
    vehicle?: VehicleModel;
    service?: string;
    promoCode?: string;
}

const ENDPOINT_URL = '/device/info';

@Injectable({ providedIn: 'root' })
export class DeviceInfoService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    getDeviceInfo(payload: DeviceInfoRequestModel): Observable<DeviceInfoModelResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<DeviceInfoModelResponse>>(`${url}${ENDPOINT_URL}`, payload, options).pipe(map(response => response.data)))
        );
    }
}
