import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiIconMarineModule } from '@de-care/shared/sxm-ui/ui-icon-marine';

interface DataModel {
    vehicle?: string;
    radioId?: string;
    plans: string[];
    username?: string;
    nickname?: string;
    index?: number;
    streamingServiceStatus: boolean | null;
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
    selector: 'sxm-ui-marine-subscription-actions',
    templateUrl: './marine-subscription-actions.component.html',
    styleUrls: ['./marine-subscription-actions.component.scss'],
})
export class SxmUiMarineSubscriptionActionsComponent implements ComponentWithLocale {
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
    declarations: [SxmUiMarineSubscriptionActionsComponent],
    exports: [SxmUiMarineSubscriptionActionsComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule, SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiIconMarineModule],
})
export class SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule {}
