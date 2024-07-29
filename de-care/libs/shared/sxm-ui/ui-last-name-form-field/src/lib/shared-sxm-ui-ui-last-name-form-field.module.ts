import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastNameFormFieldComponent } from './last-name-form-field/last-name-form-field.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiTrimFormFieldModule],
    declarations: [LastNameFormFieldComponent],
    exports: [LastNameFormFieldComponent]
})
export class SharedSxmUiUiLastNameFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
