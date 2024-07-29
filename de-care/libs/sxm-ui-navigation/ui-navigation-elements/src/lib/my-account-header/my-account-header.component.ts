import { Component, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NAVIGATION_ELEMENTS_BASE_URLS, NavigationElementsBaseUrls } from '../tokens';
import { ComponentLocale, ComponentWithLocale, LanguageResources, SxmLanguages, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { NavLinks, SxmUiHeaderWithUserPresenceComponent, SxmUiHeaderWithUserPresenceComponentApi } from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { Observable } from 'rxjs';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    template: `
        <sxm-ui-header-with-user-presence [name]="name"></sxm-ui-header-with-user-presence>
        <sxm-ui-nav-with-user-presence
            [name]="name"
            [accountNumber]="accountNumber"
            [links]="links$ | async"
            [activeLinkIndex]="activeLinkIndex"
        ></sxm-ui-nav-with-user-presence>
    `,
    styleUrls: ['./my-account-header.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class MyAccountHeaderComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() name: string;
    @Input() accountNumber: string | number;
    @Input() activeLinkIndex: number;
    @Input() get closePanels() {
        return () => {
            this._sxmUiHeaderWithUserPresenceComponent?.closePanels();
        };
    }
    @Input() set langPref(lang: SxmLanguages) {
        if (lang) {
            this.translationsForComponentService.setCurrentLang(lang);
        }
    }
    links$: Observable<NavLinks[]>;
    accountPanelOpen = false;
    loggedIn = false;
    @ViewChild(SxmUiHeaderWithUserPresenceComponent) private readonly _sxmUiHeaderWithUserPresenceComponent: SxmUiHeaderWithUserPresenceComponentApi;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _translateService: TranslateService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly _baseUrls: NavigationElementsBaseUrls
    ) {
        translationsForComponentService.init(this);
        this.links$ = this._translateService.stream(`${this.translateKeyPrefix}.LINKS`).pipe(
            // NOTE: the ngx-translate lib does not support token replacement in nested resource keys (only the top level key you query)
            //       so we need to do the token replacement ourselves after getting the top level key value
            map((links) => links.map((link) => ({ ...link, url: link.url.replace('{{careUrl}}', this._baseUrls.careUrl) })))
        );
    }

    onAccountPresenceIconClicked() {
        this.accountPanelOpen = !this.accountPanelOpen;
    }
}
