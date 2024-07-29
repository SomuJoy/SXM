import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiIconCarModule } from '@de-care/shared/sxm-ui/ui-icon-car';
import { SharedSxmUiUiIconAviationModule } from '@de-care/shared/sxm-ui/ui-icon-aviation';
import { SharedSxmUiUiIconMarineModule } from '@de-care/shared/sxm-ui/ui-icon-marine';

interface DataModel {
    vehicle?: string;
    radioId?: string;
    nickname?: string;
    index?: number;
    isInactiveDueToNonPay?: boolean;
    vehicleType?: 'CAR' | 'AVIATION' | 'MARINE';
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-inactive-subscription-actions',
    templateUrl: './inactive-subscription-actions.component.html',
    styleUrls: ['./inactive-subscription-actions.component.scss'],
})
export class SxmUiInactiveSubscriptionActionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @Input() data: DataModel;
    @Output() activate = new EventEmitter();
    @Output() removeDevice = new EventEmitter();
    @Output() cancelInactiveDevice = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiInactiveSubscriptionActionsComponent],
    exports: [SxmUiInactiveSubscriptionActionsComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiIconCarModule,
        SharedSxmUiUiIconAviationModule,
        SharedSxmUiUiIconMarineModule,
    ],
})
export class SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule {}
