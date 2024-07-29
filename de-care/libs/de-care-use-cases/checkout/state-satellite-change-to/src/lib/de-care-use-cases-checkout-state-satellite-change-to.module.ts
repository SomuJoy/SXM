import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsIdentityStateFlepzLookupModule } from '@de-care/domains/identity/state-flepz-lookup';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './state/effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsIdentityStateFlepzLookupModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
    ],
})
export class DeCareUseCasesCheckoutStateSatelliteChangeToModule {}
