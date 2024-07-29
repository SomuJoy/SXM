import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-add-second-radio-to-platinum-vip',
    templateUrl: './add-second-radio-to-platinum-vip.component.html',
    styleUrls: ['./add-second-radio-to-platinum-vip.component.scss'],
})
export class SxmUiAddSecondRadioToPlatinumVipComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Output() addSecondRadio: EventEmitter<string | void> = new EventEmitter();
    @Input() pvipSubId: string;
    @Input() ariaDescribedbyTextId = uuid();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiProceedButtonModule],
    declarations: [SxmUiAddSecondRadioToPlatinumVipComponent],
    exports: [SxmUiAddSecondRadioToPlatinumVipComponent],
})
export class SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumVipModule {}
