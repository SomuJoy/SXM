import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { LoadQuoteEffectsService } from './state/effects';
import { NewSubscriptionPlanCodeEffects } from './state/effects/new-subscription-plan-code.effects';
import { NewSubscriptionPriceEffects } from './state/effects/new-subscription-plan-price.effects';
import { RenewalSubscriptionPlanCodeEffects } from './state/effects/renewal-subscription-plan-code.effects';
import { RenewalSubscriptionPriceEffects } from './state/effects/renewal-subscription-plan-price.effects';
import { NewSubscriptionTermLengthEffects } from './state/effects/new-subscription-term-length.effects.';
import { RenewalSubscriptionTaxEffects } from './state/effects/renewal-subscription-plan-tax.effects';
import { RenewalSubscriptionRoyaltyFeeEffects } from './state/effects/renewal-subscription-plan-royalty-fee.effects';
import { RenewalSubscriptionActivationFeeEffects } from './state/effects/renewal-subscription-plan-activation-fee.effects';
import { NewSubscriptionTaxEffects } from './state/effects/new-subscription-plan-tax.effects';
import { NewSubscriptionRoyaltyFeeEffects } from './state/effects/new-subscription-plan-royalty-fee.effects';
import { NewSubscriptionActivationFeeEffects } from './state/effects/new-subscription-plan-activation-fee.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([
            LoadQuoteEffectsService,
            NewSubscriptionPlanCodeEffects,
            NewSubscriptionPriceEffects,
            NewSubscriptionTermLengthEffects,
            NewSubscriptionTaxEffects,
            NewSubscriptionRoyaltyFeeEffects,
            NewSubscriptionActivationFeeEffects,
            RenewalSubscriptionPlanCodeEffects,
            RenewalSubscriptionPriceEffects,
            RenewalSubscriptionTaxEffects,
            RenewalSubscriptionRoyaltyFeeEffects,
            RenewalSubscriptionActivationFeeEffects
        ])
    ]
})
export class DomainsQuotesStateQuoteModule {}
