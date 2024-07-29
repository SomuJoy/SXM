import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
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
    selector: 'sxm-ui-manage-streaming-subscription-header',
    templateUrl: './manage-streaming-subscription-header.component.html',
    styleUrls: ['./manage-streaming-subscription-header.component.scss'],
})
export class SxmUiManageStreamingSubscriptionHeaderComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Output() back = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiManageStreamingSubscriptionHeaderComponent],
    exports: [SxmUiManageStreamingSubscriptionHeaderComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiManageStreamingSubscriptionHeaderModule {}
