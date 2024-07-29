import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, concatMap } from 'rxjs/operators';
import { Ip2LocationInterface } from './ip2-location.interface';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const UTILITY_IP2_LOCATION = '/utility/ip2location';

@Injectable({ providedIn: 'root' })
export class IpToLocationService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store, @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken) {}

    /**
     * @deprecated Use libs/de-care-use-cases/shared/ui-router-common/src/lib/routing/LoadIpLocationAndSetProvinceCanActivateService
     * or libs/domains/utility/state-ip-location/src/lib/workflows/GetProvinceFromCurrentIpWorkflowService
     */
    getIp2LocationInfo(ipAddress: Ip2LocationInterface): Observable<string> {
        const params = { ...ipAddress };
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => {
                return this._countrySettings.countryCode.toLowerCase() === 'ca'
                    ? this._http.post<MicroservicesResponse<{ region: string }>>(`${url}${UTILITY_IP2_LOCATION}`, params, options).pipe(
                          map((response) => {
                              return response.data && response.data?.region?.toUpperCase();
                          })
                      )
                    : of(null);
            })
        );
    }
}
