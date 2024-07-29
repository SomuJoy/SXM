import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-app-username-action',
    templateUrl: './app-username-action.component.html',
    styleUrls: ['./app-username-action.component.scss'],
})
export class SxmUiAppUsernameActionComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() username: string;
    @Output() editUsername = new EventEmitter();
    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiAppUsernameActionComponent],
    exports: [SxmUiAppUsernameActionComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule],
})
export class SharedSxmUiSubscriptionsUiAppUsernameActionModule {}
