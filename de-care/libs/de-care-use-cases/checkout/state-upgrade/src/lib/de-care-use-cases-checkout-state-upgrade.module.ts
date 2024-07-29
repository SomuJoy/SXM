import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsOffersStateOffersModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsOffersStatePackageDescriptionsModule,
    ],
})
export class DeCareUseCasesCheckoutStateUpgradeModule {}
