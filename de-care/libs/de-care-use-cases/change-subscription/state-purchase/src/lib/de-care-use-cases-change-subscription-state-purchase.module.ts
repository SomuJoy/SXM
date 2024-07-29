import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { EffectsModule } from '@ngrx/effects';
import { PaymentInfoEffects } from './state/effects/payment-info.effects';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { TermTypeEffects } from './state/effects/term-type-effects.service';
import { MultiPackageSelectionEffects } from './state/effects/multipackage-selection.effects';
import { DomainsOffersStateOffersInfoModule } from '@de-care/domains/offers/state-offers-info';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([PaymentInfoEffects, TermTypeEffects, MultiPackageSelectionEffects]),
        DomainsOffersStateOffersModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DomainsOffersStateOffersInfoModule,
        DomainsOffersStateOffersWithCmsModule,
    ],
})
export class DeCareUseCasesChangeSubscriptionStatePurchaseModule {}
