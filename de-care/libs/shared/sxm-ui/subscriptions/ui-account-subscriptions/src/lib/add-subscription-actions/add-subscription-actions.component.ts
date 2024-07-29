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
    selector: 'sxm-ui-add-subscription-actions',
    templateUrl: './add-subscription-actions.component.html',
    styleUrls: ['./add-subscription-actions.component.scss'],
})
export class SxmUiAddSubscriptionActionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() carAndStreaming = new EventEmitter();
    @Output() streaming = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiAddSubscriptionActionsComponent],
    exports: [SxmUiAddSubscriptionActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiIconAdditionalSubscriptionsModule],
})
export class SharedSxmUiSubscriptionsUiAddSubscriptionActionsModule {}
