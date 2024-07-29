import { DomainsOffersUiOfferCardModule } from '@de-care/domains/offers/ui-offer-card';
import { SxmUiModule } from '@de-care/sxm-ui';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfferCardFormFieldComponent } from './offer-card-form-field/offer-card-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';

const DECLARATIONS = [OfferCardFormFieldComponent];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, SxmUiModule, DomainsOffersUiOfferCardModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsOffersUiOfferCardFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
