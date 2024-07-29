import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { userSetLanguage, provinceChanged, getSelectedProvince, getProvinceList } from '@de-care/domains/customer/state-locale';
import { select, Store } from '@ngrx/store';
import { ShellComponentTheming } from '../shell-component-theming.interface';
import { UserSettingsService } from '@de-care/settings';

@Component({
    selector: 'de-care-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
    translationKeyPrefix = 'DeCareUseCasesSharedUiShellModule.ShellComponent';
    selectedProvince$ = this._store.pipe(select(getSelectedProvince));
    provinces$ = this._store.pipe(select(getProvinceList));
    theming: ShellComponentTheming;
    constructor(private readonly _store: Store, private readonly _route: ActivatedRoute, private readonly _userSettingsService: UserSettingsService) {}

    ngOnInit(): void {
        this.theming = this._route.snapshot.data?.theming;
    }

    switchLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
        // NOTE: layout-main used to handle updating the dateformat, but the shell doesn't use layout-main
        this._userSettingsService.setDateFormatBasedOnLocale(lang);
    }

    onUserChangedProvince(province: string) {
        this._store.dispatch(provinceChanged({ province }));
    }
}
