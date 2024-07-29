import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { IpToLocationService } from '../data-services/get-ip2location.service';
import { setCountryCode, setProvinceFromIp } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class GetCountryCodeFromCurrentIpWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _ipToLocationService: IpToLocationService, private readonly _store: Store) {}
    build() {
        return this._ipToLocationService.getIp2LocationInfo({}).pipe(
            tap((data) => {
                this._store.dispatch(setProvinceFromIp({ regionName: data.regionName, region: data.region }));
                this._store.dispatch(setCountryCode(data.countryCode));
            })
        );
    }
}
