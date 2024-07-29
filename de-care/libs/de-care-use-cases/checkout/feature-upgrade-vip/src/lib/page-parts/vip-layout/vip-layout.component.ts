import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { userSetLanguage, provinceChanged, getSelectedProvince, getProvinceList } from '@de-care/domains/customer/state-locale';
import { select, Store } from '@ngrx/store';
import { UserSettingsService } from '@de-care/settings';

@Component({
    selector: 'de-care-vip-layout',
    templateUrl: './vip-layout.component.html',
    styleUrls: ['./vip-layout.component.scss'],
})
export class VipLayoutComponent {
    translationKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.VipLayoutComponent.';
    selectedProvince$ = this._store.pipe(select(getSelectedProvince));
    provinces$ = this._store.pipe(select(getProvinceList));

    constructor(private readonly _store: Store, private readonly _route: ActivatedRoute, private readonly _userSettingsService: UserSettingsService) {}

    switchLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
        // NOTE: layout-main used to handle updating the dateformat, but the shell doesn't use layout-main
        this._userSettingsService.setDateFormatBasedOnLocale(lang);
    }

    onUserChangedProvince(province: string) {
        this._store.dispatch(provinceChanged({ province }));
    }
}
