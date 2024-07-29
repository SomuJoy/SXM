import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { RadioIdAndALastnameLookupFormComponent } from './radio-id-and-lastname-lookup-form/radio-id-and-lastname-lookup-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioidFormFieldModule } from '@de-care/shared/sxm-ui/ui-radioid-form-field';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';

const declarations = [RadioIdAndALastnameLookupFormComponent];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiRadioidFormFieldModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiLastNameFormFieldModule,
    ],
    declarations,
    exports: declarations,
})
export class DomainsIdentificationUiRadioIdAndLastnameLookupFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
