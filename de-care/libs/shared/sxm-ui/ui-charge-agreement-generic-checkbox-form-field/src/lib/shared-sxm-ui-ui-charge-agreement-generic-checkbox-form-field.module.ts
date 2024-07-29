import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SxmUiChargeAgreementGenericCheckboxFormFieldComponent } from './charge-agreement-generic-checkbox-form-field/charge-agreement-generic-checkbox-form-field.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule.forChild()],
    declarations: [SxmUiChargeAgreementGenericCheckboxFormFieldComponent],
    exports: [SxmUiChargeAgreementGenericCheckboxFormFieldComponent],
})
export class SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
        //TODO: After settling how to handle spanish translations, this library must be implemented with the new translation and SCAM patterns
        // Add Spanish translations
        if (!translateService.langs.includes('es-US')) {
            translateService.addLangs(['es-US']);
        }
        const t = { ...require('./i18n/module.es-US.json') };
        translateService.setTranslation('es-US', t, true);
    }
}
