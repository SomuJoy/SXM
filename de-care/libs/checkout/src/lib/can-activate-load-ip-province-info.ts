import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, map, take } from 'rxjs/operators';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { DataUtilityService } from '@de-care/data-services';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CanActivateLoadIpProvinceInfo implements CanActivate {
    constructor(private _settingsService: SettingsService, private _userSettingsService: UserSettingsService, private _dataUtilityService: DataUtilityService) {}

    canActivate(route: ActivatedRouteSnapshot) {
        if (!this._settingsService.isCanadaMode) {
            return of(true);
        }
        return this._dataUtilityService.getIp2LocationInfo({}).pipe(
            map((result) => {
                this._userSettingsService.setSelectedCanadianProvince(result);
                return true;
            }),
            catchError(() => {
                this._userSettingsService.setSelectedCanadianProvince();
                return of(true);
            })
        );
    }
}
