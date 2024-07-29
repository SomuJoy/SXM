import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiEnableShowPasswordModule } from '@de-care/shared/sxm-ui/ui-enable-show-password';
import { SxmUiPasswordStrengthComponent } from './password-strength/password-strength.component';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PasswordFormFieldComponent } from './password-form-field/password-form-field.component';
import { SxmUiPasswordRequirementsCopyComponent } from './password-requirements-copy/password-requirements-copy.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiInputFocusModule, SharedSxmUiUiEnableShowPasswordModule],
    declarations: [SxmUiPasswordStrengthComponent, PasswordFormFieldComponent, SxmUiPasswordRequirementsCopyComponent],
    exports: [SxmUiPasswordStrengthComponent, PasswordFormFieldComponent, SxmUiPasswordRequirementsCopyComponent],
})
export class SharedSxmUiUiPasswordFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
