import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS, TranslationSettingsToken, COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { map, startWith } from 'rxjs/operators';

export interface PageShellBasicRouteConfiguration {
    headerTheme: 'blue' | 'black' | 'gray' | null;
    allowProvinceBar: boolean;
    disallowProvinceSelection?: boolean;
}

@Component({
    selector: 'de-care-page-shell-basic',
    template: `<header deCarePageFullWidthContent>
            <section id="provinceHeaderBar" *ngIf="showProvinceBar">
                <de-care-current-province></de-care-current-province>
                <de-care-province-selection
                    *ngIf="!hideProvinceSelection"
                    [class.blue-container-theme]="blueHeaderMode"
                    [class.black-container-theme]="blackHeaderMode"
                    [class.gray-container-theme]="grayHeaderMode"
                ></de-care-province-selection>
            </section>
            <section id="mainHeaderBar">
                <span>
                    <a
                        [attr.aria-label]="translateKeyPrefix + 'SXM_URL_ARIA_LABEL' | translate"
                        [href]="translateKeyPrefix + 'SXM_URL_LINK' | translate"
                        sxmUiDataClickTrack="ui"
                    >
                        <mat-icon svgIcon="logo"></mat-icon>
                    </a>
                </span>
                <aside *ngIf="translationSettings.canToggleLanguage">
                    <button data-language-toggle *ngFor="let lang of langsToSwitchTo$ | async" (click)="changeLanguage(lang.key)">{{ lang.text }}</button>
                </aside>
            </section>
        </header>
        <main>
            <router-outlet></router-outlet>
        </main>
        <footer deCarePageFullWidthContent>
            <de-care-page-footer-basic></de-care-page-footer-basic>
        </footer>`,
    styleUrls: ['./page-shell-basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellBasicComponent implements OnInit {
    translateKeyPrefix = 'DeCareSharedUiPageShellBasicModule.PageShellBasicComponent.';
    @HostBinding('class.blue-header-theme') blueHeaderMode = false;
    @HostBinding('class.black-header-theme') blackHeaderMode = false;
    @HostBinding('class.gray-header-theme') grayHeaderMode = false;
    showProvinceBar = false;
    hideProvinceSelection = false;

    private readonly _currentLang$ = this._translateService.onLangChange.pipe(
        map((langInfo) => langInfo.lang),
        startWith(this._translateService.currentLang)
    );
    langsToSwitchTo$ = this._currentLang$.pipe(
        map((currentLang) => this.translationSettings?.languagesSupported?.filter((lang) => lang !== currentLang)),
        map((langs) => langs.map((lang) => ({ text: lang.split('-')[0], key: lang })))
    );

    constructor(
        private readonly _route: ActivatedRoute,
        @Inject(TRANSLATION_SETTINGS) public translationSettings: TranslationSettingsToken,
        @Inject(COUNTRY_SETTINGS) public countrySettings: CountrySettingsToken,
        private readonly _translateService: TranslateService
    ) {}

    ngOnInit(): void {
        const configuration: PageShellBasicRouteConfiguration = this._route.snapshot.data?.pageShellBasic;
        switch (configuration?.headerTheme) {
            case 'blue': {
                this.blueHeaderMode = true;
                break;
            }
            case 'black': {
                this.blackHeaderMode = true;
                break;
            }
            case 'gray': {
                this.grayHeaderMode = true;
                break;
            }
            default: {
                this.blueHeaderMode = false;
                this.blackHeaderMode = false;
                this.grayHeaderMode = false;
                break;
            }
        }
        this.showProvinceBar = configuration?.allowProvinceBar && this.countrySettings?.countryCode.toLowerCase() === 'ca';
        this.hideProvinceSelection = !!(configuration?.disallowProvinceSelection && this.countrySettings?.countryCode.toLowerCase() === 'ca');
    }

    changeLanguage(lang: string) {
        this._translateService.use(lang);
    }
}
