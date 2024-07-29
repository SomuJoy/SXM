import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, concatMap } from 'rxjs/operators';
import { Ip2LocationInterface } from './ip2-location.interface';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

const UTILITY_IP2_LOCATION = '/utility/ip2location';

@Injectable({ providedIn: 'root' })
export class IpToLocationService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}
    getIp2LocationInfo(ipAddress: Ip2LocationInterface): Observable<any> {
        const params = { ...ipAddress };
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<string>>(`${url}${UTILITY_IP2_LOCATION}`, params, options).pipe(
                    map((response) => {
                        return response.data;
                    })
                )
            )
        );
    }
}
