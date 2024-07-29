import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
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
    selector: 'sxm-ui-manage-subscription-header-with-nickname',
    templateUrl: './manage-subscription-header-with-nickname.component.html',
    styleUrls: ['./manage-subscription-header-with-nickname.component.scss'],
})
export class SxmUiManageSubscriptionHeaderWithNicknameComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    @Input() data: SubscriptionHeaderModel;
    @Output() back = new EventEmitter();
    @Output() editNickname = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiManageSubscriptionHeaderWithNicknameComponent],
    exports: [SxmUiManageSubscriptionHeaderWithNicknameComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule],
})
export class SharedSxmUiManageSubscriptionHeaderWithNicknameModule {}
