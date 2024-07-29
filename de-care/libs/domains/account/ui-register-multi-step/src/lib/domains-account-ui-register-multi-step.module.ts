import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomainsAccountUiSecurityQuestionsFormFieldsModule } from '@de-care/domains/account/ui-security-questions-form-fields';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegistrationAddressStepComponent } from './page-parts/registration-address-step/registration-address-step.component';
import { RegistrationCredentialsStepComponent } from './page-parts/registration-credentials-step/registration-credentials-step.component';
import { RegistrationSecurityQuestionsStepComponent } from './page-parts/registration-security-questions-step/registration-security-questions-step.component';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        DomainsAccountUiSecurityQuestionsFormFieldsModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiModalModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedValidationFormControlInvalidModule
    ],
    declarations: [RegistrationAddressStepComponent, RegistrationCredentialsStepComponent, RegistrationSecurityQuestionsStepComponent],
    exports: [RegistrationAddressStepComponent, RegistrationCredentialsStepComponent, RegistrationSecurityQuestionsStepComponent]
})
export class DomainsAccountUiRegisterMultiStepModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
