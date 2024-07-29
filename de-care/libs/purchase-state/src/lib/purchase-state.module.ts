import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ResetToInitialStateEffect } from './store/effects/reset-to-initial-state.effect';
import { PurchaseReducers } from './store/reducers/purchase.reducers';
import { PaymentEffects } from './store/effects/payment.effects';
import { DataEffects } from './store/effects/data.effect';
import { UpsellEffects } from './store/effects/upsell.effects';
import { ChangeSubscriptionEffects } from './store/effects/change-subscription.effect';
import { ServiceErrorEffects } from './store/effects/service-error.effects';
import { AddSubscriptionEffects } from './store/effects/add-subscription.effect';
import { CreateAccountEffects } from './store/effects/create-account.effect';
import { PurchaseStateConstant } from './purchase-state.constant';
import { PackageUpgradesEffects } from './store/effects/package-upgrades.effects';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';

@NgModule({
    imports: [
        StoreModule.forFeature(PurchaseStateConstant.STORE.NAME, PurchaseReducers),
        EffectsModule.forFeature([
            PaymentEffects,
            DataEffects,
            UpsellEffects,
            ChangeSubscriptionEffects,
            ServiceErrorEffects,
            AddSubscriptionEffects,
            CreateAccountEffects,
            PackageUpgradesEffects,
            ResetToInitialStateEffect,
        ]),
        DomainsQuotesStateQuoteModule,
    ],
})
export class PurchaseStateModule {}
