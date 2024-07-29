import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-account-login-action',
    templateUrl: './account-login-action.component.html',
    styleUrls: ['./account-login-action.component.scss'],
})
export class SxmUiAccountLoginActionComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() username: string;
    @Output() editAccountLogin = new EventEmitter();
    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiAccountLoginActionComponent],
    exports: [SxmUiAccountLoginActionComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiUiAccountLoginActionModule {}
