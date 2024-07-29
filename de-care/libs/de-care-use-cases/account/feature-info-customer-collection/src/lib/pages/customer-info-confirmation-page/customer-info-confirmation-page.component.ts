import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-customer-info-confirmation-page',
    templateUrl: './customer-info-confirmation-page.component.html',
    styleUrls: ['./customer-info-confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInfoConfirmationPageComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
