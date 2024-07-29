import { PriceIncreaseMessageComponent } from './price-increase-message/price-increase-message.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const DECLARATIONS = [PriceIncreaseMessageComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsOffersUiPriceIncreaseMessageModule extends ModuleWithTranslation {
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
