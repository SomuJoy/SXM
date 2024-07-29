import { NgModule } from '@angular/core';
import { featureKey, reducer } from './state/reducer';
import { StoreModule } from '@ngrx/store';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './state/effects';
import { DomainsCmsStateCampaignsModule } from '@de-care/domains/cms/state-campaigns';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DomainsOffersStateUpsellsWithCmsModule } from '@de-care/domains/offers/state-upsells-with-cms';
import { DomainsUtilityStateCardBinRangesModule } from '@de-care/domains/utility/state-card-bin-ranges';
import { DomainsIdentityStateFlepzLookupModule } from '@de-care/domains/identity/state-flepz-lookup';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsCmsStateCampaignsModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsUtilityStateCardBinRangesModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsOffersStateUpsellsWithCmsModule,
        DomainsIdentityStateFlepzLookupModule,
    ],
    providers: [],
})
export class DeCareUseCasesCheckoutStateSatelliteModule {}
