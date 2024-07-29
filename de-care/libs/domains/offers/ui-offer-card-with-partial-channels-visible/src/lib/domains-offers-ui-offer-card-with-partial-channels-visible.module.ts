import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { DomainsOffersUiOfferDescriptionModule } from '@de-care/domains/offers/ui-offer-description';
import { DomainsOffersUiPlanDescriptionChannelsModule } from '@de-care/domains/offers/ui-plan-description-channels';
import { DomainsOffersUiPlanGridModule } from '@de-care/domains/offers/ui-plan-grid';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfferCardWithPartialChannelsVisibleComponent } from './offer-card-with-partial-channels-visible/offer-card-with-partial-channels-visible.component';

const DECLARATIONS = [OfferCardWithPartialChannelsVisibleComponent];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        SharedSxmUiUiAccordionChevronModule,
        DomainsOffersUiPlanDescriptionChannelsModule,
        DomainsOffersUiPlanGridModule,
        DomainsOffersUiOfferDescriptionModule
    ],
    declarations: [DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsOffersUiOfferCardWithPartialChannelsVisibleModule extends ModuleWithTranslation {
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
