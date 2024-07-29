import { Component, Output, EventEmitter, Input, Inject } from '@angular/core';
import { LogoutWorkflowService } from '@de-care/domains/account/state-login';
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
    selector: 'account-panel-non-pii',
    templateUrl: './account-panel-non-pii.component.html',
    styleUrls: ['./account-panel-non-pii.component.scss'],
})
export class AccountPanelNonPiiComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    platform: string;

    @Input() firstName: string;
    @Input() identifiedThroughLogin: boolean;
    @Output() loggedOut = new EventEmitter();
    @Output() closed = new EventEmitter();

    careUrl = this._baseUrls.careUrl;
    oacUrl = this._baseUrls.oacUrl;
    dotComUrl = this._baseUrls.dotComUrl?.length ? this._baseUrls.dotComUrl : 'https://www.siriusxm.com/';

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _logoutWorkflowService: LogoutWorkflowService,
        @Inject(NAVIGATION_ELEMENTS_BASE_URLS) public readonly _baseUrls: NavigationElementsBaseUrls
    ) {
        translationsForComponentService.init(this);
        this.platform = getPlatform();
    }

    logout(): void {
        this._logoutWorkflowService.build({ source: 'PHX' }).subscribe(() => {
            this.loggedOut.emit();
        });
    }
}
