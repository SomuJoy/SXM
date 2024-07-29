import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconAdditionalSubscriptionsModule } from '@de-care/shared/sxm-ui/ui-icon-additional-subscriptions';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-new-subscription-actions',
    templateUrl: './new-subscription-actions.component.html',
    styleUrls: ['./new-subscription-actions.component.scss'],
})
export class SxmUiNewSubscriptionActionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() carAndStreaming = new EventEmitter();
    @Output() streaming = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiNewSubscriptionActionsComponent],
    exports: [SxmUiNewSubscriptionActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconAdditionalSubscriptionsModule],
})
export class SharedSxmUiSubscriptionsUiNewSubscriptionActionsModule {}
