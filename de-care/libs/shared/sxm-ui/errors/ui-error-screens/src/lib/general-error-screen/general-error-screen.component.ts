import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-general-error-screen',
    templateUrl: './general-error-screen.component.html',
    styleUrls: ['./general-error-screen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiGeneralErrorScreenComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiGeneralErrorScreenComponent],
    exports: [SxmUiGeneralErrorScreenComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SxmUiGeneralErrorScreenComponentModule {}
