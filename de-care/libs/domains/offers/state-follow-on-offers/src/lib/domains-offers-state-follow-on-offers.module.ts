import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { followOnOffersFeatureKey, reducer } from './state/follow-on-offers.reducer';
import { FollowOnOffersEffects } from './state/follow-on-offers.effects';

@NgModule({
    imports: [StoreModule.forFeature(followOnOffersFeatureKey, reducer), EffectsModule.forFeature([FollowOnOffersEffects])]
})
export class DomainsOffersStateFollowOnOffersModule {}
