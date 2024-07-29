import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromOffers from './state/reducers/offers.reducer';
import { LoadOffersEffects } from './state/effects/load-offers.effects';
import { LoadChangeSubscriptionOffersEffects } from './state/effects/load-change-subscription-offers.effects';
import { DataChangeOffersService } from './data-services/data-change-offers.service';

// TODO: Remove this as soon as SSO simulation tooling is in place for local dev development
import { mockDataChangeOffersService } from './mock-data-change-offers.service';
import { OffersSummaryBehaviorEffects } from './state/effects/offers-summary-behavior.effects';
import { PresentmentTestCellBehaviorEffects } from './state/effects/presentment-test-cell-behavior.effects';

@NgModule({
    // TODO: Remove this as soon as SSO simulation tooling is in place for local dev development
    providers: [{ provide: DataChangeOffersService, useValue: mockDataChangeOffersService }],
    imports: [
        StoreModule.forFeature(fromOffers.offersFeatureKey, fromOffers.reducer),
        EffectsModule.forFeature([LoadOffersEffects, LoadChangeSubscriptionOffersEffects, OffersSummaryBehaviorEffects, PresentmentTestCellBehaviorEffects]),
    ],
})
export class DomainsOffersStateOffersModule {}
