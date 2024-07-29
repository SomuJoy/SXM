import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { SxmUiAccountNumberFormFieldComponent } from './account-number-form-field/account-number-form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild()],
    declarations: [SxmUiAccountNumberFormFieldComponent],
    exports: [SxmUiAccountNumberFormFieldComponent]
})
export class SharedSxmUiUiAccountNumberFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
