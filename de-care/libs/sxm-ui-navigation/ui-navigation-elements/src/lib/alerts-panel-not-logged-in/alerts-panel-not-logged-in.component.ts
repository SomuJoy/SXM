import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'alerts-panel-not-logged-in',
    templateUrl: './alerts-panel-not-logged-in.component.html',
    styleUrls: ['./alerts-panel-not-logged-in.component.scss'],
})
export class AlertsPanelNotLoggedInComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Output() closed = new EventEmitter();
    @Output() signInClicked = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}
