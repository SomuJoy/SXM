import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { userSetLanguage } from '@de-care/domains/customer/state-locale';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'de-care-shell-basic-with-lang-toggle',
    templateUrl: './shell-basic-with-lang-toggle.component.html',
    styleUrls: ['./shell-basic-with-lang-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellBasicWithLangToggleComponent implements OnInit {
    darkMode = false;
    languageSelectionEnabled$ = this._store.pipe(select(getIsCanadaMode));

    constructor(private readonly _route: ActivatedRoute, private readonly _store: Store) {}

    ngOnInit(): void {
        this.darkMode = this._route.snapshot.data?.shellBasicWithLangToggle?.darkMode;
    }

    changeLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
    }
}
