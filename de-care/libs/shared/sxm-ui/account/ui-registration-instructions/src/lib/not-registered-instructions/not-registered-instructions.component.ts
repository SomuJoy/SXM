import { Component, NgModule } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-not-registered-instructions',
    template: `
        <p>
            <strong>{{ translateKeyPrefix + '.TITLE' | translate }}</strong>
        </p>
        <ol>
            <li *ngFor="let step of translateKeyPrefix + '.STEPS' | translate">
                <p [innerHTML]="step"></p>
            </li>
        </ol>
    `,
    styleUrls: ['./not-registered-instructions.component.scss'],
})
export class SxmUiNotRegisteredInstructionsComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SxmUiNotRegisteredInstructionsComponent],
    exports: [SxmUiNotRegisteredInstructionsComponent],
})
export class SharedSxmUiUiNotRegisteredInstructionsModule {}
