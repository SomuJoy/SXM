import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
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
    selector: 'sxm-ui-add-second-radio-to-platinum-two-device-bundle',
    templateUrl: './add-second-radio-to-platinum-two-device-bundle.component.html',
    styleUrls: ['./add-second-radio-to-platinum-two-device-bundle.component.scss'],
})
export class SxmUiAddSecondRadioToPlatinumTwoDeviceBundleComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() ariaDescribedbyTextId = uuid();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SxmUiAddSecondRadioToPlatinumTwoDeviceBundleComponent],
    exports: [SxmUiAddSecondRadioToPlatinumTwoDeviceBundleComponent],
})
export class SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumTwoDeviceBundleModule {}
