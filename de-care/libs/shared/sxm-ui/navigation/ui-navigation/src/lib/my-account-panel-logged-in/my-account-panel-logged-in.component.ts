import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Output, EventEmitter, Input, Inject, NgModule } from '@angular/core';
import { getUserAgentPlatform } from '@de-care/shared/browser-common/user-agent';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiMobileAppCtaModule } from '../mobile-app-cta/mobile-app-cta.component';

interface DataModel {
    firstName: string;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-my-account-panel-logged-in',
    templateUrl: './my-account-panel-logged-in.component.html',
    styleUrls: ['./my-account-panel-logged-in.component.scss'],
})
export class SxmUiMyAccountPanelLoggedInComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    @Input() data: DataModel;

    @Output() logout = new EventEmitter();
    @Output() closed = new EventEmitter();

    platform: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, @Inject(DOCUMENT) readonly document: Document) {
        translationsForComponentService.init(this);
        this.platform = getUserAgentPlatform(document.defaultView.navigator.userAgent);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiMobileAppCtaModule],
    declarations: [SxmUiMyAccountPanelLoggedInComponent],
    exports: [SxmUiMyAccountPanelLoggedInComponent],
})
export class SxmUiMyAccountPanelLoggedInComponentModule {}
