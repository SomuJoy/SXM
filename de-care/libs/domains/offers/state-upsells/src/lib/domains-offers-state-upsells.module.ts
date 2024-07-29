import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './state/effects';
import { reducer, upsellsFeatureKey } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(upsellsFeatureKey, reducer), EffectsModule.forFeature([Effects])],
})
export class DomainsOffersStateUpsellsModule {}
