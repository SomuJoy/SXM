import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionHeaderModel } from '../../interface';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-manage-subscription-header-with-ymm',
    templateUrl: './manage-subscription-header-with-ymm.component.html',
    styleUrls: ['./manage-subscription-header-with-ymm.component.scss'],
})
export class SxmUiManageSubscriptionHeaderWithYmmComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: SubscriptionHeaderModel;
    @Output() back = new EventEmitter();
    @Output() addNickname = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiManageSubscriptionHeaderWithYmmComponent],
    exports: [SxmUiManageSubscriptionHeaderWithYmmComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule],
})
export class SharedSxmUiManageSubscriptionHeaderWithYmmModule {}
