import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDescriptionComponent } from './offer-description/offer-description.component';
import { OfferDescriptionOemComponent } from './offer-description/offer-description-oem/offer-description-oem.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsOffersUiPackageDescriptionsModule } from '@de-care/domains/offers/ui-package-descriptions';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        // TODO: move WithoutPlatformNamePipe into stand alone lib so we don't need the entire SxmUiModule here
        SxmUiModule,
        DomainsOffersUiPackageDescriptionsModule
    ],
    declarations: [OfferDescriptionComponent, OfferDescriptionOemComponent],
    exports: [OfferDescriptionComponent, OfferDescriptionOemComponent]
})
export class DomainsOffersUiOfferDescriptionModule extends ModuleWithTranslation {
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
