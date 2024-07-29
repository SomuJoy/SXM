import { Component, Inject } from '@angular/core';
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
    selector: 'account-panel-with-login-link',
    templateUrl: './account-panel-with-login-link.component.html',
    styleUrls: ['./account-panel-with-login-link.component.scss'],
})
export class AccountPanelWithLoginLinkComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    isProcessingLogin = false;
    platform: string;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly baseUrls: NavigationElementsBaseUrls
    ) {
        translationsForComponentService.init(this);
        this.platform = getPlatform();
    }
}
