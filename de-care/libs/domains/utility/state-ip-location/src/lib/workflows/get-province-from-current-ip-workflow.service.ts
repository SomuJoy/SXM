import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { mapTo, tap } from 'rxjs/operators';
import { IpToLocationService } from '../data-services/get-ip2location.service';
import { setProvinceFromIp } from '../state/actions';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetProvinceFromCurrentIpWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _ipToLocationService: IpToLocationService,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}
    build() {
        return this._countrySettings.countryCode.toLowerCase() === 'ca'
            ? this._ipToLocationService.getIp2LocationInfo({}).pipe(
                  tap((data) => {
                      this._store.dispatch(setProvinceFromIp({ regionName: data.regionName, region: data.region }));
                  }),
                  mapTo(true)
              )
            : of(true);
    }
}
