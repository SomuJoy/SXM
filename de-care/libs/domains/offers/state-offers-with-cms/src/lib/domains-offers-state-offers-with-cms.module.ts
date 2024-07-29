import { NgModule } from '@angular/core';
import { DomainsOffersStateOffersInfoModule } from '@de-care/domains/offers/state-offers-info';
import { DomainsOffersStateUpsellOffersInfoModule } from '@de-care/domains/offers/state-upsell-offers-info';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { LoadRenewalOffersWithCmsContent } from './workflows/load-renewal-offers-with-cms-content.service';
import { LoadOffersWithCmsContent } from './workflows/load-offers-with-cms-content.service';
import { LoadCustomerOffersWithCmsContent } from './workflows/load-customer-offers-with-cms-content.service';
import { LoadOffersAndRenewalsWithCmsContent } from './workflows/load-offers-and-renewals-with-cms-content.service';
import { LoadCustomerOffersAndRenewalWithCmsContent } from './workflows/load-customer-offers-and-renewals-with-cms-content.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { DomainsOffersStateFollowOnOffersModule } from '@de-care/domains/offers/state-follow-on-offers';
import { LoadOffersAndFollowOnsForStreamingWithCmsContent } from './workflows/load-offers-and-followons-for-streaming-with-cms-content.service';
import { LoadChangeSubscriptionOffersWithCmsContent } from './workflows/load-change-subscription-offers-with-cms-content.service';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        DomainsOffersStateOffersModule,
        DomainsOffersStateOffersInfoModule,
        DomainsOffersStateUpsellOffersInfoModule,
        DomainsOffersStateFollowOnOffersModule,
        CommonModule,
        TranslateModule.forChild(),
    ],
    providers: [
        LoadOffersWithCmsContent,
        LoadCustomerOffersWithCmsContent,
        LoadRenewalOffersWithCmsContent,
        LoadOffersAndRenewalsWithCmsContent,
        LoadCustomerOffersAndRenewalWithCmsContent,
        LoadOffersAndFollowOnsForStreamingWithCmsContent,
        SharedStateFeatureFlagsModule,
        LoadChangeSubscriptionOffersWithCmsContent,
    ],
})
export class DomainsOffersStateOffersWithCmsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
