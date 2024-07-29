import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { OrderSummaryOemComponent } from './order-summary/order-summary-oem/order-summary-oem.component';
import { QuoteSummaryComponent } from './order-summary/quote-summary/quote-summary.component';
import { DomainsQuotesUiQuoteLineItemModule } from '@de-care/domains/quotes/ui-quote-line-item';
import { DomainsQuotesUiCurrentQuoteModule } from '@de-care/domains/quotes/ui-current-quote';
import { DomainsOffersUiPackageDescriptionsModule } from '@de-care/domains/offers/ui-package-descriptions';
import { DomainsQuotesUiFutureQuoteModule } from '@de-care/domains/quotes/ui-future-quote';
import { DomainsQuotesUiPromoRenewalQuoteModule } from '@de-care/domains/quotes/ui-promo-renewal-quote';
import { DomainsQuotesUiProRatedRenewalQuoteModule } from '@de-care/domains/quotes/ui-pro-rated-renewal-quote';
import { DomainsQuotesUiRenewalQuoteModule } from '@de-care/domains/quotes/ui-renewal-quote';

const DECLARATIONS = [OrderSummaryComponent, QuoteSummaryComponent, OrderSummaryOemComponent];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forChild(),
        SxmUiModule,
        DomainsQuotesUiQuoteLineItemModule,
        DomainsQuotesUiCurrentQuoteModule,
        DomainsOffersUiPackageDescriptionsModule,
        DomainsQuotesUiFutureQuoteModule,
        DomainsQuotesUiPromoRenewalQuoteModule,
        DomainsQuotesUiProRatedRenewalQuoteModule,
        DomainsQuotesUiRenewalQuoteModule
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsQuotesUiOrderSummaryModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/quotes.en-CA.json'),
            'en-US': require('./i18n/quotes.en-US.json'),
            'fr-CA': require('./i18n/quotes.fr-CA.json')
        };
        super(translateService, languages);
    }
}
