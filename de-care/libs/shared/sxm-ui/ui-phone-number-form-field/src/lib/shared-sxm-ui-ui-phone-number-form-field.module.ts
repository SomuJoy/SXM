import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiPhoneNumberFormFieldComponent } from './phone-number-form-field/phone-number-form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiFormFieldMasksModule],
    declarations: [SxmUiPhoneNumberFormFieldComponent],
    exports: [SxmUiPhoneNumberFormFieldComponent]
})
export class SharedSxmUiUiPhoneNumberFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
