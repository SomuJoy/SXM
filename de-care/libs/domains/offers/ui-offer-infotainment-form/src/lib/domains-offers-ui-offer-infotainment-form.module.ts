import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OfferInfotainmentFormComponent } from './offer-infotainment-form/offer-infotainment-form.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsOffersUiOfferCardModule } from '@de-care/domains/offers/ui-offer-card';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';

const DECLARATIONS = [OfferInfotainmentFormComponent];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TranslateModule.forChild(), DomainsOffersUiOfferCardModule, SxmUiModule, SharedSxmUiUiPrimaryPackageCardModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DomainsOffersUiOfferInfotainmentFormModule extends ModuleWithTranslation {
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
