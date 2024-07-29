import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { USStateDropdownFormFieldComponent } from './us-state-dropdown-form-field/us-state-dropdown-form-field.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiDropdownFormFieldModule],
    declarations: [USStateDropdownFormFieldComponent],
    exports: [USStateDropdownFormFieldComponent]
})
export class SharedSxmUiUiUsStateDropdownFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {},
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': {}
        };

        super(translateService, languages);
    }
}
