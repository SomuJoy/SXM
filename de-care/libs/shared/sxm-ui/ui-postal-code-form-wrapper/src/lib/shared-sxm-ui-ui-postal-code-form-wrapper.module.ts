import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { SxmUiPostalCodeFormWrapperComponent } from '../lib/postal-code-form-wrapper/postal-code-form-wrapper.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiPostalCodeFormFieldModule],
    declarations: [SxmUiPostalCodeFormWrapperComponent],
    exports: [SxmUiPostalCodeFormWrapperComponent],
})
export class SharedSxmUiUiPostalCodeFormWrapperModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
