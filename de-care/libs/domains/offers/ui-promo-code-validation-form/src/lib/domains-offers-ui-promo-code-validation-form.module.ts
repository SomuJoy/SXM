import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PromoCodeValidationComponent } from './promo-code-validation/promo-code-validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { MarketingPromoCodeFormComponent } from './marketing-promo-code-form/marketing-promo-code-form.component';

const DECLARATIONS = [PromoCodeValidationComponent, MarketingPromoCodeFormComponent];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiTrimFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        FormsModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DomainsOffersUiPromoCodeValidationFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);

        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
