import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { ActiveSubscriptionPlanCodeEffects } from './state/effects/active-subscription-plan-code.effects';
import { ActiveSubscriptionRadioIdEffects } from './state/effects/active-subscription-radio-id.effects';
import { ActiveSubscriptionServiceIdEffects } from './state/effects/active-subscription-service-id.effects';
import { ActiveSubscriptionIdEffects } from './state/effects/active-subscription-id.effects';
import { CustomerCoreInfoEffects } from './state/effects/customer-core-info.effects';
import { AccountInfoTrackingEffects } from './state/effects/account-info-tracking.effects';
import { AccountInfoPatchingEffects } from './state/effects/account-info-patching.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([
            ActiveSubscriptionPlanCodeEffects,
            ActiveSubscriptionRadioIdEffects,
            ActiveSubscriptionServiceIdEffects,
            ActiveSubscriptionIdEffects,
            CustomerCoreInfoEffects,
            AccountInfoTrackingEffects,
            AccountInfoPatchingEffects,
        ]),
    ],
})
export class DomainsAccountStateAccountModule {}
