import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { ValidateLpzFormComponent } from './validate-lpz-form/validate-lpz-form.component';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiPrivacyPolicyModule,
    ],
    declarations: [ValidateLpzFormComponent],
    exports: [ValidateLpzFormComponent],
})
export class DomainsIdentificationUiValidateLpzFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
