import { Component, OnInit } from '@angular/core';
import { getCorpId } from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { getProvinceList, getSelectedProvince, provinceChanged, userSetLanguage } from '@de-care/domains/customer/state-locale';
import { partnerInfoTranslationPrefix } from '@de-care/domains/partner/state-partner-info';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'de-care-partner-shell',
    templateUrl: './partner-shell.component.html',
    styleUrls: ['./partner-shell.component.scss']
})
export class PartnerShellComponent implements OnInit {
    readonly translationKeyPrefix = 'DeCareUseCasesTrialActivationUiPartnerShellModule.PartnerShellComponent';
    readonly partnerTranslationKeyPrefix = partnerInfoTranslationPrefix;

    selectedProvince$ = this._store.pipe(select(getSelectedProvince));
    provinces$ = this._store.pipe(select(getProvinceList));
    corpId$ = this._store.pipe(select(getCorpId));

    constructor(private _store: Store) {}

    ngOnInit(): void {}

    switchLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
    }

    onUserChangedProvince(province: string) {
        this._store.dispatch(provinceChanged({ province }));
    }
}
