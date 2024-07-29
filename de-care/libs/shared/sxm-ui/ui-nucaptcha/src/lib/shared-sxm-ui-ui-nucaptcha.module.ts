import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomainsUtilityStateNucaptchaModule } from '@de-care/domains/utility/state-nucaptcha';
import { SxmUiNucaptchaComponent } from './nucaptcha/nucaptcha.component';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';

@NgModule({
    imports: [
        CommonModule,
        DomainsUtilityStateNucaptchaModule,
        ReactiveFormsModule,
        SharedValidationFormControlInvalidModule,
        TranslateModule.forChild(),
        SharedSxmUiUiInputFocusModule
    ],
    declarations: [SxmUiNucaptchaComponent],
    exports: [SxmUiNucaptchaComponent]
})
export class SharedSxmUiUiNucaptchaModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
