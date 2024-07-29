import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';

interface DataModel {
    index?: number;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-seasonally-suspended-streaming-inactive-subscriptions',
    templateUrl: './seasonally-suspended-streaming-inactive-subscriptions.component.html',
    styleUrls: ['./seasonally-suspended-streaming-inactive-subscriptions.component.scss'],
})
export class SxmUiSeasonallySuspendedStreamingInactiveSubscriptionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() activateSuspendedDevice = new EventEmitter();
    @Output() cancelSuspendedDevice = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiSeasonallySuspendedStreamingInactiveSubscriptionsComponent],
    exports: [SxmUiSeasonallySuspendedStreamingInactiveSubscriptionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiIconStreamingModule],
})
export class SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule {}
