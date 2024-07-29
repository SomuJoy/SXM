import { Inject, Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { GetProvinceFromCurrentIpWorkflowService, getProvinceFromIp } from '@de-care/domains/utility/state-ip-location';
import { Observable, of } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { Store } from '@ngrx/store';
import { PROVINCE_SELECTION, ProvinceSelection } from '@de-care/de-care/shared/ui-province-selection';

@Injectable({ providedIn: 'root' })
export class LoadIpLocationAndSetProvinceAsyncCanActivateService implements CanActivate {
    constructor(
        private readonly _getProvinceFromCurrentIpWorkflowService: GetProvinceFromCurrentIpWorkflowService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        @Inject(PROVINCE_SELECTION) private readonly _provinceSelection: ProvinceSelection,
        private readonly _store: Store
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        if (this._countrySettings.countryCode.toLowerCase() === 'ca') {
            this._getProvinceFromCurrentIpWorkflowService
                .build()
                .pipe(
                    withLatestFrom(this._store.select(getProvinceFromIp)),
                    tap(([, provinceCode]) => {
                        this._provinceSelection?.setSelectedProvince(provinceCode);
                    })
                )
                .subscribe();
        }
        return of(true);
    }
}
