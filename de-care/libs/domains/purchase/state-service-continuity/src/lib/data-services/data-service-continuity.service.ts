import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiPrefix } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map, take, concatMap } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { ServiceContinuityResponse, ServiceContinuityRequest } from './service-continuity.interface';
import { select, Store } from '@ngrx/store';

const ENDPOINT_URL = '/purchase/service-continuity';

@Injectable({ providedIn: 'root' })
export class DataServiceContinuityService {
    constructor(private _http: HttpClient, private readonly _store: Store) {}

    serviceContinuity(request: ServiceContinuityRequest): Observable<ServiceContinuityResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => {
                return this._http.post<MicroservicesResponse<ServiceContinuityResponse>>(`${url}${ENDPOINT_URL}`, request, options);
            }),
            map(response => response.data)
        );
    }
}
