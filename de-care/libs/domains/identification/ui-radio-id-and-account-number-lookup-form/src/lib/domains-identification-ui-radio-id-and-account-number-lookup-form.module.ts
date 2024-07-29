import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { RadioIdAndAccountNumberLookupFormComponent } from './radio-id-and-account-number-lookup-form/radio-id-and-account-number-lookup-form.component';
import { SharedSxmUiUiRadioidFormFieldModule } from '@de-care/shared/sxm-ui/ui-radioid-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiAccountNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-account-number-form-field';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiRadioidFormFieldModule,
        SharedSxmUiUiAccountNumberFormFieldModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule
    ],
    declarations: [RadioIdAndAccountNumberLookupFormComponent],
    exports: [RadioIdAndAccountNumberLookupFormComponent]
})
export class DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
