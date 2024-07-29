import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';

interface DataModel {
    vehicle?: string;
    radioId?: string;
    plans: string[];
    username?: string;
    index?: number;
    isTrial?: boolean;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-streaming-subscription-actions',
    templateUrl: './streaming-subscription-actions.component.html',
    styleUrls: ['./streaming-subscription-actions.component.scss'],
})
export class SxmUiStreamingSubscriptionActionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() manage = new EventEmitter();
    @Output() editUsername = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiStreamingSubscriptionActionsComponent],
    exports: [SxmUiStreamingSubscriptionActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule, SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiIconStreamingModule],
})
export class SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule {}
