import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { LoginFormFieldsComponent } from './login-form-fields/login-form-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiPasswordFormFieldModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiInputFocusModule
    ],
    declarations: [LoginFormFieldsComponent],
    exports: [LoginFormFieldsComponent]
})
export class DomainsAccountUiLoginFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-login-form-fields.en-CA.json') },
            'en-US': { ...require('./i18n/ui-login-form-fields.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-login-form-fields.fr-CA.json') }
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(false);
        }

        super(translateService, languages);
    }
}
