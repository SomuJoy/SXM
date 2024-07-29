import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PartnerInfoEffects } from './state/effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([PartnerInfoEffects])]
})
export class DomainsPartnerStatePartnerInfoModule {
    constructor() {}
}
