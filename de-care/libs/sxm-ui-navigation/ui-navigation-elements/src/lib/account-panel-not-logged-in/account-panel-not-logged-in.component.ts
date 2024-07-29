import { Component, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getPlatform } from '../helper';
import { NavigationElementsBaseUrls, NAVIGATION_ELEMENTS_BASE_URLS } from '../tokens';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'account-panel-not-logged-in',
    templateUrl: './account-panel-not-logged-in.component.html',
    styleUrls: ['./account-panel-not-logged-in.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class AccountPanelNotLoggedInComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    platform: string;
    careUrl = this._baseUrls.careUrl;
    @Output() closed = new EventEmitter();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly _baseUrls: NavigationElementsBaseUrls
    ) {
        translationsForComponentService.init(this);
        this.platform = getPlatform();
    }
}
