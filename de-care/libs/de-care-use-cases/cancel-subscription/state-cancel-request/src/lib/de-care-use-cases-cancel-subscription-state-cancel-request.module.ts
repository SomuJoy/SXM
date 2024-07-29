import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { featureKey, reducer } from './state/reducer';
import { AcceptOfferEffects } from './state/effects/accept-offer.effects';
import { EffectsModule } from '@ngrx/effects';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { AdobeEffects } from './state/effects/adobe.effects';
import { OfferEffects } from './state/effects/offer.effects';
import { DomainsOffersStateOffersInfoModule } from '@de-care/domains/offers/state-offers-info';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsAccountStateAccountManagementModule } from '@de-care/domains/account/state-management';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { TrackCancelOnlineEffects } from './state/effects/track-cancel-online.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([AcceptOfferEffects, AdobeEffects, OfferEffects, TrackCancelOnlineEffects]),
        DomainsOffersStatePackageDescriptionsModule,
        DomainsCustomerStateLocaleModule,
        DomainsOffersStateOffersModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsUtilityStateEnvironmentInfoModule,
        SharedStateFeatureFlagsModule,
        DomainsOffersStateOffersInfoModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsAccountStateAccountManagementModule,
    ],
})
export class DeCareUseCasesCancelSubscriptionStateCancelRequestModule {}
