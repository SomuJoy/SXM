import { Injectable } from '@angular/core';
import { DataUtilityService } from '@de-care/data-services';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { UserSettingsService } from '@de-care/settings';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IPProvinceQuebecWorkflow implements DataWorkflow<void, boolean> {
    constructor(private _dataUtilityService: DataUtilityService, private _userSettingsService: UserSettingsService) {}

    build() {
        return this._dataUtilityService.getIp2LocationInfo({}).pipe(
            tap((prov) => this._userSettingsService.setSelectedCanadianProvince(prov)),
            withLatestFrom(this._userSettingsService.isQuebec$),
            map(([_, isQuebec]) => isQuebec)
        );
    }
}
