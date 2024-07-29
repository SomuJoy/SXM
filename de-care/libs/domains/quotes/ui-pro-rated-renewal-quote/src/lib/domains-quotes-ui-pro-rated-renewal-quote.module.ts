import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { DomainsQuotesUiPackageDescriptionLineItemModule } from '@de-care/domains/quotes/ui-package-description-line-item';
import { DomainsQuotesUiQuoteLineItemModule } from '@de-care/domains/quotes/ui-quote-line-item';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProRatedRenewalQuoteComponent } from './pro-rated-renewal-quote/pro-rated-renewal-quote.component';
import { DomainsOffersUiPackageDescriptionsModule } from '@de-care/domains/offers/ui-package-descriptions';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forChild(),
        SxmUiModule,
        DomainsQuotesUiQuoteLineItemModule,
        DomainsQuotesUiPackageDescriptionLineItemModule,
        DomainsOffersUiPackageDescriptionsModule
    ],
    declarations: [ProRatedRenewalQuoteComponent],
    exports: [ProRatedRenewalQuoteComponent]
})
export class DomainsQuotesUiProRatedRenewalQuoteModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
