import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiPostalCodeFormFieldComponent } from './postal-code-form-field/postal-code-form-field.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiFormFieldMasksModule],
    declarations: [SxmUiPostalCodeFormFieldComponent],
    exports: [SxmUiPostalCodeFormFieldComponent]
})
export class SharedSxmUiUiPostalCodeFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
