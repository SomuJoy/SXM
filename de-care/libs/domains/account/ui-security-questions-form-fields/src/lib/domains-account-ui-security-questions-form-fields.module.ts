import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityQuestionsFormFieldsComponent } from './security-questions-form-fields/security-questions-form-fields.component';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { QuestionsAvailableFilterPipe } from './questions-available-filter.pipe';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiTextFormFieldModule, SharedSxmUiUiDropdownFormFieldModule],
    declarations: [SecurityQuestionsFormFieldsComponent, QuestionsAvailableFilterPipe],
    exports: [SecurityQuestionsFormFieldsComponent]
})
export class DomainsAccountUiSecurityQuestionsFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
