import { Injectable, Inject } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { GetProvinceFromCurrentIpWorkflowService } from '@de-care/domains/utility/state-ip-location';
import { Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class LoadIpLocationCanActivateService implements CanActivate {
    constructor(
        private readonly _getProvinceFromCurrentIpWorkflowService: GetProvinceFromCurrentIpWorkflowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._countrySettings.countryCode.toLowerCase() === 'ca' ? this._getProvinceFromCurrentIpWorkflowService.build().pipe(mapTo(true)) : of(true);
    }
}
