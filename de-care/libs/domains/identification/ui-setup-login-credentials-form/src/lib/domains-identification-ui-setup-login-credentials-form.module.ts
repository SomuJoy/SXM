import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SetupLoginCredentialsComponent } from './setup-login-credentials/setup-login-credentials.component';
import { LoginCredentialsEmailAsUsernameFormFieldsComponent } from './login-credentials-email-as-username-form-fields/login-credentials-email-as-username-form-fields.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule
    ],
    declarations: [SetupLoginCredentialsComponent, LoginCredentialsEmailAsUsernameFormFieldsComponent],
    exports: [SetupLoginCredentialsComponent, LoginCredentialsEmailAsUsernameFormFieldsComponent]
})
export class DomainsIdentificationUiSetupLoginCredentialsFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
