import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiFirstNameFormFieldComponent } from './first-name-form-field/first-name-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule.forChild()],
    declarations: [SxmUiFirstNameFormFieldComponent],
    exports: [SxmUiFirstNameFormFieldComponent],
})
export class SharedSxmUiFormsUiFirstNameFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
