import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { SubscriptionManagementEffects } from './state/subscription-management-effects';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([SubscriptionManagementEffects])],
})
export class DomainsAccountStateAccountManagementModule {}
