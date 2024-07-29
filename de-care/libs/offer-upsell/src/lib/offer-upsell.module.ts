import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SalesCommonModule } from '@de-care/sales-common';
import { OffersModule } from '@de-care/offers';
import { OfferUpsellComponent } from './offer-upsell/offer-upsell.component';
import { ModuleWithTranslation, LanguageResources, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PriceDifferencePipe } from './offer-upsell/price-difference.pipe';
import { MCPTranslationKeyPipe } from './offer-upsell/mcp-translation-key.pipe';
import { SharedSxmUiUiWithoutPlatformNamePipeModule } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

const DECLARATIONS = [OfferUpsellComponent, PriceDifferencePipe, MCPTranslationKeyPipe];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, SxmUiModule, SalesCommonModule, OffersModule, SharedSxmUiUiWithoutPlatformNamePipeModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class OfferUpsellModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/offer-upsell.en-CA.json'),
            'en-US': require('./i18n/offer-upsell.en-US.json'),
            'fr-CA': require('./i18n/offer-upsell.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
