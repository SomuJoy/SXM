import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { SxmUiUsernameFormFieldComponent } from './username-form-field/username-form-field.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiTrimFormFieldModule],
    declarations: [SxmUiUsernameFormFieldComponent],
    exports: [SxmUiUsernameFormFieldComponent],
})
export class SharedSxmUiUiUsernameFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
