import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';

interface DataModel {
    vehicle?: string;
    radioId?: string;
    plans: string[];
    username?: string;
    nickname?: string;
    index?: number;
    linkKey?: string;
    isTrial: boolean;
    streamingServiceStatus: boolean | null;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-active-subscription-actions',
    templateUrl: './active-subscription-actions.component.html',
    styleUrls: ['./active-subscription-actions.component.scss'],
})
export class SxmUiActiveSubscriptionActionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() manage = new EventEmitter();
    @Output() editOrCreateUsername = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiActiveSubscriptionActionsComponent],
    exports: [SxmUiActiveSubscriptionActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule, SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiIconCarModule],
})
export class SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule {}
